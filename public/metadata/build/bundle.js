
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35731/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.32.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const LOCATION = {};
    const ROUTER = {};

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    function getLocation(source) {
      return {
        ...source.location,
        state: source.history.state,
        key: (source.history.state && source.history.state.key) || "initial"
      };
    }

    function createHistory(source, options) {
      const listeners = [];
      let location = getLocation(source);

      return {
        get location() {
          return location;
        },

        listen(listener) {
          listeners.push(listener);

          const popstateListener = () => {
            location = getLocation(source);
            listener({ location, action: "POP" });
          };

          source.addEventListener("popstate", popstateListener);

          return () => {
            source.removeEventListener("popstate", popstateListener);

            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
          };
        },

        navigate(to, { state, replace = false } = {}) {
          state = { ...state, key: Date.now() + "" };
          // try...catch iOS Safari limits to 100 pushState calls
          try {
            if (replace) {
              source.history.replaceState(state, null, to);
            } else {
              source.history.pushState(state, null, to);
            }
          } catch (e) {
            source.location[replace ? "replace" : "assign"](to);
          }

          location = getLocation(source);
          listeners.forEach(listener => listener({ location, action: "PUSH" }));
        }
      };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
      let index = 0;
      const stack = [{ pathname: initialPathname, search: "" }];
      const states = [];

      return {
        get location() {
          return stack[index];
        },
        addEventListener(name, fn) {},
        removeEventListener(name, fn) {},
        history: {
          get entries() {
            return stack;
          },
          get index() {
            return index;
          },
          get state() {
            return states[index];
          },
          pushState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            index++;
            stack.push({ pathname, search });
            states.push(state);
          },
          replaceState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            stack[index] = { pathname, search };
            states[index] = state;
          }
        }
      };
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = Boolean(
      typeof window !== "undefined" &&
        window.document &&
        window.document.createElement
    );
    const globalHistory = createHistory(canUseDOM ? window : createMemorySource());
    const { navigate } = globalHistory;

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    const paramRe = /^:(.+)/;

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    function startsWith(string, search) {
      return string.substr(0, search.length) === search;
    }

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    function isRootSegment(segment) {
      return segment === "";
    }

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    function isDynamic(segment) {
      return paramRe.test(segment);
    }

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    function isSplat(segment) {
      return segment[0] === "*";
    }

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri) {
      return (
        uri
          // Strip starting/ending `/`
          .replace(/(^\/+|\/+$)/g, "")
          .split("/")
      );
    }

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    function stripSlashes(str) {
      return str.replace(/(^\/+|\/+$)/g, "");
    }

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
      const score = route.default
        ? 0
        : segmentize(route.path).reduce((score, segment) => {
            score += SEGMENT_POINTS;

            if (isRootSegment(segment)) {
              score += ROOT_POINTS;
            } else if (isDynamic(segment)) {
              score += DYNAMIC_POINTS;
            } else if (isSplat(segment)) {
              score -= SEGMENT_POINTS + SPLAT_PENALTY;
            } else {
              score += STATIC_POINTS;
            }

            return score;
          }, 0);

      return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
      return (
        routes
          .map(rankRoute)
          // If two routes have the exact same score, we go by index instead
          .sort((a, b) =>
            a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
          )
      );
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { path, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
      let match;
      let default_;

      const [uriPathname] = uri.split("?");
      const uriSegments = segmentize(uriPathname);
      const isRootUri = uriSegments[0] === "";
      const ranked = rankRoutes(routes);

      for (let i = 0, l = ranked.length; i < l; i++) {
        const route = ranked[i].route;
        let missed = false;

        if (route.default) {
          default_ = {
            route,
            params: {},
            uri
          };
          continue;
        }

        const routeSegments = segmentize(route.path);
        const params = {};
        const max = Math.max(uriSegments.length, routeSegments.length);
        let index = 0;

        for (; index < max; index++) {
          const routeSegment = routeSegments[index];
          const uriSegment = uriSegments[index];

          if (routeSegment !== undefined && isSplat(routeSegment)) {
            // Hit a splat, just grab the rest, and return a match
            // uri:   /files/documents/work
            // route: /files/* or /files/*splatname
            const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

            params[splatName] = uriSegments
              .slice(index)
              .map(decodeURIComponent)
              .join("/");
            break;
          }

          if (uriSegment === undefined) {
            // URI is shorter than the route, no match
            // uri:   /users
            // route: /users/:userId
            missed = true;
            break;
          }

          let dynamicMatch = paramRe.exec(routeSegment);

          if (dynamicMatch && !isRootUri) {
            const value = decodeURIComponent(uriSegment);
            params[dynamicMatch[1]] = value;
          } else if (routeSegment !== uriSegment) {
            // Current segments don't match, not dynamic, not splat, so no match
            // uri:   /users/123/settings
            // route: /users/:id/profile
            missed = true;
            break;
          }
        }

        if (!missed) {
          match = {
            route,
            params,
            uri: "/" + uriSegments.slice(0, index).join("/")
          };
          break;
        }
      }

      return match || default_ || null;
    }

    /**
     * Check if the `path` matches the `uri`.
     * @param {string} path
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
      return pick([route], uri);
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    function addQuery(pathname, query) {
      return pathname + (query ? `?${query}` : "");
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
      // /foo/bar, /baz/qux => /foo/bar
      if (startsWith(to, "/")) {
        return to;
      }

      const [toPathname, toQuery] = to.split("?");
      const [basePathname] = base.split("?");
      const toSegments = segmentize(toPathname);
      const baseSegments = segmentize(basePathname);

      // ?a=b, /users?b=c => /users?a=b
      if (toSegments[0] === "") {
        return addQuery(basePathname, toQuery);
      }

      // profile, /users/789 => /users/789/profile
      if (!startsWith(toSegments[0], ".")) {
        const pathname = baseSegments.concat(toSegments).join("/");

        return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
      }

      // ./       , /users/123 => /users/123
      // ../      , /users/123 => /users
      // ../..    , /users/123 => /
      // ../../one, /a/b/c/d   => /a/b/one
      // .././one , /a/b/c/d   => /a/b/c/one
      const allSegments = baseSegments.concat(toSegments);
      const segments = [];

      allSegments.forEach(segment => {
        if (segment === "..") {
          segments.pop();
        } else if (segment !== ".") {
          segments.push(segment);
        }
      });

      return addQuery("/" + segments.join("/"), toQuery);
    }

    /**
     * Combines the `basepath` and the `path` into one path.
     * @param {string} basepath
     * @param {string} path
     */
    function combinePaths(basepath, path) {
      return `${stripSlashes(
    path === "/" ? basepath : `${stripSlashes(basepath)}/${stripSlashes(path)}`
  )}/`;
    }

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
      return (
        !event.defaultPrevented &&
        event.button === 0 &&
        !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
      );
    }

    /* node_modules/svelte-routing/src/Router.svelte generated by Svelte v3.32.1 */

    function create_fragment(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 256) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[8], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $base;
    	let $location;
    	let $routes;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Router", slots, ['default']);
    	let { basepath = "/" } = $$props;
    	let { url = null } = $$props;
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const routes = writable([]);
    	validate_store(routes, "routes");
    	component_subscribe($$self, routes, value => $$invalidate(7, $routes = value));
    	const activeRoute = writable(null);
    	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

    	// If locationContext is not set, this is the topmost Router in the tree.
    	// If the `url` prop is given we force the location to it.
    	const location = locationContext || writable(url ? { pathname: url } : globalHistory.location);

    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(6, $location = value));

    	// If routerContext is set, the routerBase of the parent Router
    	// will be the base for this Router's descendants.
    	// If routerContext is not set, the path and resolved uri will both
    	// have the value of the basepath prop.
    	const base = routerContext
    	? routerContext.routerBase
    	: writable({ path: basepath, uri: basepath });

    	validate_store(base, "base");
    	component_subscribe($$self, base, value => $$invalidate(5, $base = value));

    	const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
    		// If there is no activeRoute, the routerBase will be identical to the base.
    		if (activeRoute === null) {
    			return base;
    		}

    		const { path: basepath } = base;
    		const { route, uri } = activeRoute;

    		// Remove the potential /* or /*splatname from
    		// the end of the child Routes relative paths.
    		const path = route.default
    		? basepath
    		: route.path.replace(/\*.*$/, "");

    		return { path, uri };
    	});

    	function registerRoute(route) {
    		const { path: basepath } = $base;
    		let { path } = route;

    		// We store the original path in the _path property so we can reuse
    		// it when the basepath changes. The only thing that matters is that
    		// the route reference is intact, so mutation is fine.
    		route._path = path;

    		route.path = combinePaths(basepath, path);

    		if (typeof window === "undefined") {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				activeRoute.set(matchingRoute);
    				hasActiveRoute = true;
    			}
    		} else {
    			routes.update(rs => {
    				rs.push(route);
    				return rs;
    			});
    		}
    	}

    	function unregisterRoute(route) {
    		routes.update(rs => {
    			const index = rs.indexOf(route);
    			rs.splice(index, 1);
    			return rs;
    		});
    	}

    	if (!locationContext) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = globalHistory.listen(history => {
    				location.set(history.location);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute
    	});

    	const writable_props = ["basepath", "url"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("basepath" in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ("url" in $$props) $$invalidate(4, url = $$props.url);
    		if ("$$scope" in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		derived,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		pick,
    		match,
    		stripSlashes,
    		combinePaths,
    		basepath,
    		url,
    		locationContext,
    		routerContext,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		location,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute,
    		$base,
    		$location,
    		$routes
    	});

    	$$self.$inject_state = $$props => {
    		if ("basepath" in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ("url" in $$props) $$invalidate(4, url = $$props.url);
    		if ("hasActiveRoute" in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$base*/ 32) {
    			// This reactive statement will update all the Routes' path when
    			// the basepath changes.
    			 {
    				const { path: basepath } = $base;

    				routes.update(rs => {
    					rs.forEach(r => r.path = combinePaths(basepath, r._path));
    					return rs;
    				});
    			}
    		}

    		if ($$self.$$.dirty & /*$routes, $location*/ 192) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			 {
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}
    	};

    	return [
    		routes,
    		location,
    		base,
    		basepath,
    		url,
    		$base,
    		$location,
    		$routes,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { basepath: 3, url: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-routing/src/Route.svelte generated by Svelte v3.32.1 */

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*routeParams*/ 4,
    	location: dirty & /*$location*/ 16
    });

    const get_default_slot_context = ctx => ({
    	params: /*routeParams*/ ctx[2],
    	location: /*$location*/ ctx[4]
    });

    // (40:0) {#if $activeRoute !== null && $activeRoute.route === route}
    function create_if_block(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(40:0) {#if $activeRoute !== null && $activeRoute.route === route}",
    		ctx
    	});

    	return block;
    }

    // (43:2) {:else}
    function create_else_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope, routeParams, $location*/ 532) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[9], dirty, get_default_slot_changes, get_default_slot_context);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(43:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:2) {#if component !== null}
    function create_if_block_1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[4] },
    		/*routeParams*/ ctx[2],
    		/*routeProps*/ ctx[3]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, routeParams, routeProps*/ 28)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 16 && { location: /*$location*/ ctx[4] },
    					dirty & /*routeParams*/ 4 && get_spread_object(/*routeParams*/ ctx[2]),
    					dirty & /*routeProps*/ 8 && get_spread_object(/*routeProps*/ ctx[3])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(41:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$activeRoute*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $activeRoute;
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Route", slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, "activeRoute");
    	component_subscribe($$self, activeRoute, value => $$invalidate(1, $activeRoute = value));
    	const location = getContext(LOCATION);
    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(4, $location = value));

    	const route = {
    		path,
    		// If no path prop is given, this Route will act as the default Route
    		// that is rendered if no other Route in the Router is a match.
    		default: path === ""
    	};

    	let routeParams = {};
    	let routeProps = {};
    	registerRoute(route);

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway.
    	if (typeof window !== "undefined") {
    		onDestroy(() => {
    			unregisterRoute(route);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("path" in $$new_props) $$invalidate(8, path = $$new_props.path);
    		if ("component" in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ("$$scope" in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onDestroy,
    		ROUTER,
    		LOCATION,
    		path,
    		component,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		location,
    		route,
    		routeParams,
    		routeProps,
    		$activeRoute,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), $$new_props));
    		if ("path" in $$props) $$invalidate(8, path = $$new_props.path);
    		if ("component" in $$props) $$invalidate(0, component = $$new_props.component);
    		if ("routeParams" in $$props) $$invalidate(2, routeParams = $$new_props.routeParams);
    		if ("routeProps" in $$props) $$invalidate(3, routeProps = $$new_props.routeProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$activeRoute*/ 2) {
    			 if ($activeRoute && $activeRoute.route === route) {
    				$$invalidate(2, routeParams = $activeRoute.params);
    			}
    		}

    		 {
    			const { path, component, ...rest } = $$props;
    			$$invalidate(3, routeProps = rest);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		$activeRoute,
    		routeParams,
    		routeProps,
    		$location,
    		activeRoute,
    		location,
    		route,
    		path,
    		$$scope,
    		slots
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { path: 8, component: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-routing/src/Link.svelte generated by Svelte v3.32.1 */
    const file = "node_modules/svelte-routing/src/Link.svelte";

    function create_fragment$2(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);

    	let a_levels = [
    		{ href: /*href*/ ctx[0] },
    		{ "aria-current": /*ariaCurrent*/ ctx[2] },
    		/*props*/ ctx[1],
    		/*$$restProps*/ ctx[6]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file, 40, 0, 1249);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 32768) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[15], dirty, null, null);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				(!current || dirty & /*ariaCurrent*/ 4) && { "aria-current": /*ariaCurrent*/ ctx[2] },
    				dirty & /*props*/ 2 && /*props*/ ctx[1],
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let ariaCurrent;
    	const omit_props_names = ["to","replace","state","getProps"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $base;
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Link", slots, ['default']);
    	let { to = "#" } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = () => ({}) } = $$props;
    	const { base } = getContext(ROUTER);
    	validate_store(base, "base");
    	component_subscribe($$self, base, value => $$invalidate(13, $base = value));
    	const location = getContext(LOCATION);
    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(14, $location = value));
    	const dispatch = createEventDispatcher();
    	let href, isPartiallyCurrent, isCurrent, props;

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = $location.pathname === href || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("to" in $$new_props) $$invalidate(7, to = $$new_props.to);
    		if ("replace" in $$new_props) $$invalidate(8, replace = $$new_props.replace);
    		if ("state" in $$new_props) $$invalidate(9, state = $$new_props.state);
    		if ("getProps" in $$new_props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ("$$scope" in $$new_props) $$invalidate(15, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		createEventDispatcher,
    		ROUTER,
    		LOCATION,
    		navigate,
    		startsWith,
    		resolve,
    		shouldNavigate,
    		to,
    		replace,
    		state,
    		getProps,
    		base,
    		location,
    		dispatch,
    		href,
    		isPartiallyCurrent,
    		isCurrent,
    		props,
    		onClick,
    		$base,
    		$location,
    		ariaCurrent
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("to" in $$props) $$invalidate(7, to = $$new_props.to);
    		if ("replace" in $$props) $$invalidate(8, replace = $$new_props.replace);
    		if ("state" in $$props) $$invalidate(9, state = $$new_props.state);
    		if ("getProps" in $$props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ("href" in $$props) $$invalidate(0, href = $$new_props.href);
    		if ("isPartiallyCurrent" in $$props) $$invalidate(11, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
    		if ("isCurrent" in $$props) $$invalidate(12, isCurrent = $$new_props.isCurrent);
    		if ("props" in $$props) $$invalidate(1, props = $$new_props.props);
    		if ("ariaCurrent" in $$props) $$invalidate(2, ariaCurrent = $$new_props.ariaCurrent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $base*/ 8320) {
    			 $$invalidate(0, href = to === "/" ? $base.uri : resolve(to, $base.uri));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 16385) {
    			 $$invalidate(11, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 16385) {
    			 $$invalidate(12, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 4096) {
    			 $$invalidate(2, ariaCurrent = isCurrent ? "page" : undefined);
    		}

    		if ($$self.$$.dirty & /*getProps, $location, href, isPartiallyCurrent, isCurrent*/ 23553) {
    			 $$invalidate(1, props = getProps({
    				location: $location,
    				href,
    				isPartiallyCurrent,
    				isCurrent
    			}));
    		}
    	};

    	return [
    		href,
    		props,
    		ariaCurrent,
    		base,
    		location,
    		onClick,
    		$$restProps,
    		to,
    		replace,
    		state,
    		getProps,
    		isPartiallyCurrent,
    		isCurrent,
    		$base,
    		$location,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			to: 7,
    			replace: 8,
    			state: 9,
    			getProps: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    var pagination = writable({});
    var pagedResults = writable(undefined);
    var currentProjectMetadata = writable(undefined);
    var currentProject = writable(undefined);
    var query = writable('');
    var previousRoute = writable('');
    var handleSnackbar = writable({ isSnackbar: false, message: '' });
    function getProjectsMetadata(page, q) {
        return __awaiter(this, void 0, void 0, function () {
            var protocol, port, baseUrl, baseResultsRange, route, currentResultsRange;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        protocol = window.location.protocol;
                        port = protocol === 'https:' ? '' : ':3000';
                        baseUrl = protocol + "//" + window.location.hostname + port + "/";
                        baseResultsRange = [1, 9];
                        currentResultsRange = baseResultsRange.map(function (v) { return v + ((page - 1) * baseResultsRange[1]); });
                        if (q) {
                            query.set(q);
                            route = "projects?q=" + q + "&_page=" + page + "&_limit=" + baseResultsRange[1];
                            handleSnackbar.set({ isSnackbar: true, message: "Displaying search results for query: " + q });
                        }
                        else {
                            query.set('');
                            route = "projects?_page=" + page + "&_limit=" + baseResultsRange[1];
                        }
                        console.log(baseUrl, route);
                        navigate("/" + route);
                        return [4, fetch(baseUrl + "api/v1/" + route)
                                .then(function (r) {
                                var totalCount = parseInt(r.headers.get('X-Total-Count'));
                                var totalPages = Math.floor(totalCount / baseResultsRange[1]);
                                if (!Number.isInteger(totalCount / baseResultsRange[1])) {
                                    totalPages++;
                                }
                                pagination.set({ currentPage: page, currentResultsRange: currentResultsRange, totalCount: totalCount, totalPages: totalPages });
                                return r.json();
                            })
                                .then(function (data) { pagedResults.set(data), console.log(data); })];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    }

    /* services/metadata/frontend/projects-repository/Category.svelte generated by Svelte v3.32.1 */
    const file$1 = "services/metadata/frontend/projects-repository/Category.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	child_ctx[8] = i;
    	return child_ctx;
    }

    // (23:2) {#if category.sub && category.sub.length}
    function create_if_block$1(ctx) {
    	let div;
    	let t;
    	let div_class_value;
    	let each_value_1 = /*category*/ ctx[3].sub;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(/*category*/ ctx[3].isOpen ? "visible" : "hidden") + " svelte-nrk1u"));
    			add_location(div, file$1, 23, 4, 979);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*categories, getProjectsMetadata*/ 1) {
    				each_value_1 = /*category*/ ctx[3].sub;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, t);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (dirty & /*categories*/ 1 && div_class_value !== (div_class_value = "" + (null_to_empty(/*category*/ ctx[3].isOpen ? "visible" : "hidden") + " svelte-nrk1u"))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(23:2) {#if category.sub && category.sub.length}",
    		ctx
    	});

    	return block;
    }

    // (25:6) {#each category.sub as sub, n}
    function create_each_block_1(ctx) {
    	let label;
    	let input;
    	let t0;
    	let t1_value = /*sub*/ ctx[6] + "";
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[2](/*sub*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			t1 = text(t1_value);
    			input.value = /*n*/ ctx[8];
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "name", "subcategory");
    			attr_dev(input, "class", "svelte-nrk1u");
    			add_location(input, file$1, 26, 10, 1113);
    			attr_dev(label, "class", "subcategory svelte-nrk1u");
    			add_location(label, file$1, 25, 8, 1077);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			append_dev(label, t0);
    			append_dev(label, t1);

    			if (!mounted) {
    				dispose = listen_dev(input, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*categories*/ 1 && t1_value !== (t1_value = /*sub*/ ctx[6] + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(25:6) {#each category.sub as sub, n}",
    		ctx
    	});

    	return block;
    }

    // (19:0) {#each categories as category }
    function create_each_block(ctx) {
    	let button;
    	let t0_value = /*category*/ ctx[3].name + "";
    	let t0;
    	let button_disabled_value;
    	let t1;
    	let if_block_anchor;
    	let mounted;
    	let dispose;
    	let if_block = /*category*/ ctx[3].sub && /*category*/ ctx[3].sub.length && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			button.disabled = button_disabled_value = !/*category*/ ctx[3].sub.length;
    			attr_dev(button, "class", "svelte-nrk1u");
    			add_location(button, file$1, 19, 2, 822);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*toggleCetegory*/ ctx[1](/*category*/ ctx[3]))) /*toggleCetegory*/ ctx[1](/*category*/ ctx[3]).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*categories*/ 1 && t0_value !== (t0_value = /*category*/ ctx[3].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*categories*/ 1 && button_disabled_value !== (button_disabled_value = !/*category*/ ctx[3].sub.length)) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}

    			if (/*category*/ ctx[3].sub && /*category*/ ctx[3].sub.length) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(19:0) {#each categories as category }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let each_1_anchor;
    	let each_value = /*categories*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*categories, getProjectsMetadata, toggleCetegory*/ 3) {
    				each_value = /*categories*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Category", slots, []);
    	

    	let categories = [
    		{
    			id: 1,
    			isOpen: false,
    			name: "Discipline",
    			sub: ["Agriculture", "Antropology", "Geography", "History"]
    		},
    		{
    			id: 2,
    			isOpen: false,
    			name: "Type of data",
    			sub: ["First", "Second"]
    		},
    		{
    			id: 3,
    			isOpen: false,
    			name: "Temporal coverage",
    			sub: []
    		},
    		{
    			id: 4,
    			isOpen: false,
    			name: "Spatial coverage",
    			sub: []
    		},
    		{
    			id: 5,
    			isOpen: false,
    			name: "Language",
    			sub: []
    		},
    		{
    			id: 6,
    			isOpen: false,
    			name: "Keywords",
    			sub: []
    		},
    		{
    			id: 7,
    			isOpen: false,
    			name: "Person",
    			sub: []
    		},
    		{
    			id: 8,
    			isOpen: false,
    			name: "Organization",
    			sub: ["Last", "Not least"]
    		}
    	];

    	const toggleCetegory = cat => event => {
    		let bool = cat.isOpen;
    		$$invalidate(0, categories[cat.id - 1].isOpen = !bool, categories);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Category> was created with unknown prop '${key}'`);
    	});

    	const click_handler = sub => getProjectsMetadata(1, sub);

    	$$self.$capture_state = () => ({
    		getProjectsMetadata,
    		categories,
    		toggleCetegory
    	});

    	$$self.$inject_state = $$props => {
    		if ("categories" in $$props) $$invalidate(0, categories = $$props.categories);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [categories, toggleCetegory, click_handler];
    }

    class Category extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Category",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* services/metadata/frontend/Header.svelte generated by Svelte v3.32.1 */
    const file$2 = "services/metadata/frontend/Header.svelte";

    // (43:6) <Link to="/" class="header-left regular-link">
    function create_default_slot_1(ctx) {
    	let img0;
    	let img0_src_value;
    	let t;
    	let img1;
    	let img1_src_value;

    	const block = {
    		c: function create() {
    			img0 = element("img");
    			t = space();
    			img1 = element("img");
    			attr_dev(img0, "class", "logo s-inline-block svelte-15sxsdu");
    			if (img0.src !== (img0_src_value = "assets/logo/DaSCH-Logo-black.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "DaSCH logo");
    			add_location(img0, file$2, 43, 8, 1060);
    			attr_dev(img1, "class", "icon-logo s-hidden svelte-15sxsdu");
    			if (img1.src !== (img1_src_value = "assets/icon/DaSCH-Icon-black-64.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "DaSCH logo");
    			add_location(img1, file$2, 44, 8, 1160);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img0, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, img1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(img1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(43:6) <Link to=\\\"/\\\" class=\\\"header-left regular-link\\\">",
    		ctx
    	});

    	return block;
    }

    // (42:4) <Router>
    function create_default_slot(ctx) {
    	let link;
    	let current;

    	link = new Link({
    			props: {
    				to: "/",
    				class: "header-left regular-link",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(42:4) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let header;
    	let div1;
    	let router;
    	let t0;
    	let h1;
    	let t2;
    	let div0;
    	let input0;
    	let t3;
    	let button0;
    	let svg0;
    	let path0;
    	let t4;
    	let button1;
    	let svg1;
    	let path1;
    	let t5;
    	let button2;
    	let svg2;
    	let path2;
    	let t6;
    	let div2;
    	let input1;
    	let t7;
    	let div3;
    	let category;
    	let t8;
    	let div4;
    	let a0;
    	let t10;
    	let a1;
    	let t11_value = `app.${/*getEnv*/ ctx[4]()}dasch.swiss` + "";
    	let t11;
    	let t12;
    	let a2;
    	let t13_value = `admin.${/*getEnv*/ ctx[4]()}dasch.swiss` + "";
    	let t13;
    	let t14;
    	let a3;
    	let t16;
    	let a4;
    	let current;
    	let mounted;
    	let dispose;

    	router = new Router({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	category = new Category({ $$inline: true });

    	const block = {
    		c: function create() {
    			header = element("header");
    			div1 = element("div");
    			create_component(router.$$.fragment);
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "DaSCH Metadata Browser";
    			t2 = space();
    			div0 = element("div");
    			input0 = element("input");
    			t3 = space();
    			button0 = element("button");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t4 = space();
    			button1 = element("button");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t5 = space();
    			button2 = element("button");
    			svg2 = svg_element("svg");
    			path2 = svg_element("path");
    			t6 = space();
    			div2 = element("div");
    			input1 = element("input");
    			t7 = space();
    			div3 = element("div");
    			create_component(category.$$.fragment);
    			t8 = space();
    			div4 = element("div");
    			a0 = element("a");
    			a0.textContent = "dasch.swiss";
    			t10 = space();
    			a1 = element("a");
    			t11 = text(t11_value);
    			t12 = space();
    			a2 = element("a");
    			t13 = text(t13_value);
    			t14 = space();
    			a3 = element("a");
    			a3.textContent = "docs.dasch.swiss";
    			t16 = space();
    			a4 = element("a");
    			a4.textContent = "docs-api.dasch.swiss";
    			attr_dev(h1, "class", "title svelte-15sxsdu");
    			add_location(h1, file$2, 47, 4, 1286);
    			attr_dev(input0, "class", "searchbar-in-header xs-inline-block svelte-15sxsdu");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "searchbar");
    			attr_dev(input0, "placeholder", "search...");
    			add_location(input0, file$2, 49, 6, 1369);
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			attr_dev(path0, "stroke-width", "2");
    			attr_dev(path0, "d", "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z");
    			add_location(path0, file$2, 53, 10, 1742);
    			attr_dev(svg0, "class", "icon");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "stroke", "currentColor");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg0, file$2, 52, 8, 1624);
    			attr_dev(button0, "class", "xs-hidden svelte-15sxsdu");
    			add_location(button0, file$2, 51, 6, 1560);
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke-linejoin", "round");
    			attr_dev(path1, "stroke-width", "2");
    			attr_dev(path1, "d", "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4");
    			add_location(path1, file$2, 60, 10, 2178);
    			attr_dev(svg1, "class", "icon");
    			attr_dev(svg1, "fill", "none");
    			attr_dev(svg1, "stroke", "currentColor");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg1, file$2, 59, 8, 2060);
    			set_style(button1, "display", "none");
    			attr_dev(button1, "class", "m-hidden svelte-15sxsdu");
    			add_location(button1, file$2, 58, 6, 1978);
    			attr_dev(path2, "stroke-linecap", "round");
    			attr_dev(path2, "stroke-linejoin", "round");
    			attr_dev(path2, "stroke-width", "2");
    			attr_dev(path2, "d", "M4 6h16M4 12h16M4 18h16");
    			add_location(path2, file$2, 66, 10, 2614);
    			attr_dev(svg2, "class", "icon");
    			attr_dev(svg2, "fill", "none");
    			attr_dev(svg2, "stroke", "currentColor");
    			attr_dev(svg2, "viewBox", "0 0 24 24");
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg2, file$2, 65, 8, 2496);
    			attr_dev(button2, "class", "svelte-15sxsdu");
    			add_location(button2, file$2, 64, 6, 2455);
    			attr_dev(div0, "class", "header-right svelte-15sxsdu");
    			add_location(div0, file$2, 48, 4, 1336);
    			attr_dev(div1, "class", "header-container svelte-15sxsdu");
    			add_location(div1, file$2, 40, 2, 955);
    			attr_dev(input1, "class", "searchbar svelte-15sxsdu");
    			attr_dev(input1, "name", "searchbar");
    			attr_dev(input1, "placeholder", "search...");
    			add_location(input1, file$2, 72, 4, 2846);
    			attr_dev(div2, "class", "searchbar-container xs-hidden svelte-15sxsdu");
    			toggle_class(div2, "hidden", !/*showSearchbar*/ ctx[0]);
    			add_location(div2, file$2, 71, 2, 2768);
    			attr_dev(div3, "class", "filter-container m-hidden svelte-15sxsdu");
    			toggle_class(div3, "hidden", !/*showFilters*/ ctx[1]);
    			add_location(div3, file$2, 74, 2, 2972);
    			attr_dev(a0, "class", "menu-item svelte-15sxsdu");
    			attr_dev(a0, "href", "https://dasch.swiss/");
    			add_location(a0, file$2, 78, 4, 3116);
    			attr_dev(a1, "class", "menu-item svelte-15sxsdu");
    			attr_dev(a1, "href", `https://app.${/*getEnv*/ ctx[4]()}dasch.swiss/`);
    			add_location(a1, file$2, 79, 4, 3185);
    			attr_dev(a2, "class", "menu-item svelte-15sxsdu");
    			attr_dev(a2, "href", `https://admin.${/*getEnv*/ ctx[4]()}dasch.swiss/`);
    			add_location(a2, file$2, 80, 4, 3292);
    			attr_dev(a3, "class", "menu-item svelte-15sxsdu");
    			attr_dev(a3, "href", "https://docs.dasch.swiss/");
    			add_location(a3, file$2, 81, 4, 3403);
    			attr_dev(a4, "class", "menu-item svelte-15sxsdu");
    			attr_dev(a4, "href", "https://docs-api.dasch.swiss/");
    			add_location(a4, file$2, 82, 4, 3482);
    			attr_dev(div4, "class", "menu svelte-15sxsdu");
    			toggle_class(div4, "hidden", !/*showMenu*/ ctx[2]);
    			add_location(div4, file$2, 77, 2, 3068);
    			attr_dev(header, "class", "svelte-15sxsdu");
    			add_location(header, file$2, 39, 0, 944);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div1);
    			mount_component(router, div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, h1);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, input0);
    			set_input_value(input0, /*enteredString*/ ctx[3]);
    			append_dev(div0, t3);
    			append_dev(div0, button0);
    			append_dev(button0, svg0);
    			append_dev(svg0, path0);
    			append_dev(div0, t4);
    			append_dev(div0, button1);
    			append_dev(button1, svg1);
    			append_dev(svg1, path1);
    			append_dev(div0, t5);
    			append_dev(div0, button2);
    			append_dev(button2, svg2);
    			append_dev(svg2, path2);
    			append_dev(header, t6);
    			append_dev(header, div2);
    			append_dev(div2, input1);
    			set_input_value(input1, /*enteredString*/ ctx[3]);
    			append_dev(header, t7);
    			append_dev(header, div3);
    			mount_component(category, div3, null);
    			append_dev(header, t8);
    			append_dev(header, div4);
    			append_dev(div4, a0);
    			append_dev(div4, t10);
    			append_dev(div4, a1);
    			append_dev(a1, t11);
    			append_dev(div4, t12);
    			append_dev(div4, a2);
    			append_dev(a2, t13);
    			append_dev(div4, t14);
    			append_dev(div4, a3);
    			append_dev(div4, t16);
    			append_dev(div4, a4);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "change", /*search*/ ctx[8], false, false, false),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[9]),
    					listen_dev(button0, "click", /*toggleSearchbar*/ ctx[5], false, false, false),
    					listen_dev(button1, "click", /*toggleFilters*/ ctx[6], false, false, false),
    					listen_dev(button2, "click", /*toggleMenu*/ ctx[7], false, false, false),
    					listen_dev(input1, "change", /*search*/ ctx[8], false, false, false),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[10])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);

    			if (dirty & /*enteredString*/ 8 && input0.value !== /*enteredString*/ ctx[3]) {
    				set_input_value(input0, /*enteredString*/ ctx[3]);
    			}

    			if (dirty & /*enteredString*/ 8 && input1.value !== /*enteredString*/ ctx[3]) {
    				set_input_value(input1, /*enteredString*/ ctx[3]);
    			}

    			if (dirty & /*showSearchbar*/ 1) {
    				toggle_class(div2, "hidden", !/*showSearchbar*/ ctx[0]);
    			}

    			if (dirty & /*showFilters*/ 2) {
    				toggle_class(div3, "hidden", !/*showFilters*/ ctx[1]);
    			}

    			if (dirty & /*showMenu*/ 4) {
    				toggle_class(div4, "hidden", !/*showMenu*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			transition_in(category.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			transition_out(category.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			destroy_component(router);
    			destroy_component(category);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Header", slots, []);
    	let showSearchbar = false;
    	let showFilters = false;
    	let showMenu = false;
    	let enteredString = "";

    	const getEnv = () => {
    		if (window.location.host.includes("test")) {
    			return "test.";
    		} else if (window.location.host.includes("staging")) {
    			return "staging.";
    		} else return "";
    	};

    	function toggleSearchbar() {
    		$$invalidate(0, showSearchbar = !showSearchbar);
    		$$invalidate(1, showFilters = false);
    		$$invalidate(2, showMenu = false);
    	}

    	function toggleFilters() {
    		$$invalidate(1, showFilters = !showFilters);
    		$$invalidate(0, showSearchbar = false);
    		$$invalidate(2, showMenu = false);
    	}

    	function toggleMenu() {
    		$$invalidate(2, showMenu = !showMenu);
    		$$invalidate(1, showFilters = false);
    		$$invalidate(0, showSearchbar = false);
    	}

    	let search = e => {
    		const q = e.target.value;
    		getProjectsMetadata(1, q);
    		$$invalidate(3, enteredString = "");
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		enteredString = this.value;
    		$$invalidate(3, enteredString);
    	}

    	function input1_input_handler() {
    		enteredString = this.value;
    		$$invalidate(3, enteredString);
    	}

    	$$self.$capture_state = () => ({
    		Router,
    		Link,
    		Category,
    		getProjectsMetadata,
    		showSearchbar,
    		showFilters,
    		showMenu,
    		enteredString,
    		getEnv,
    		toggleSearchbar,
    		toggleFilters,
    		toggleMenu,
    		search
    	});

    	$$self.$inject_state = $$props => {
    		if ("showSearchbar" in $$props) $$invalidate(0, showSearchbar = $$props.showSearchbar);
    		if ("showFilters" in $$props) $$invalidate(1, showFilters = $$props.showFilters);
    		if ("showMenu" in $$props) $$invalidate(2, showMenu = $$props.showMenu);
    		if ("enteredString" in $$props) $$invalidate(3, enteredString = $$props.enteredString);
    		if ("search" in $$props) $$invalidate(8, search = $$props.search);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		showSearchbar,
    		showFilters,
    		showMenu,
    		enteredString,
    		getEnv,
    		toggleSearchbar,
    		toggleFilters,
    		toggleMenu,
    		search,
    		input0_input_handler,
    		input1_input_handler
    	];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* services/metadata/frontend/Footer.svelte generated by Svelte v3.32.1 */
    const file$3 = "services/metadata/frontend/Footer.svelte";

    // (22:2) {#if version}
    function create_if_block$2(ctx) {
    	let div;
    	let t_value = `Version: v${/*version*/ ctx[0]}` + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "version svelte-qauony");
    			add_location(div, file$3, 22, 4, 1012);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*version*/ 1 && t_value !== (t_value = `Version: v${/*version*/ ctx[0]}` + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(22:2) {#if version}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let footer;
    	let t0;
    	let div;
    	let if_block = /*version*/ ctx[0] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			if (if_block) if_block.c();
    			t0 = space();
    			div = element("div");
    			div.textContent = "© 2021 DaSCH";
    			attr_dev(div, "class", "copyright");
    			add_location(div, file$3, 24, 2, 1072);
    			attr_dev(footer, "class", "svelte-qauony");
    			add_location(footer, file$3, 20, 0, 983);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			if (if_block) if_block.m(footer, null);
    			append_dev(footer, t0);
    			append_dev(footer, div);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*version*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(footer, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Footer", slots, []);

    	var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    		function adopt(value) {
    			return value instanceof P
    			? value
    			: new P(function (resolve) {
    						resolve(value);
    					});
    		}

    		return new (P || (P = Promise))(function (resolve, reject) {
    				function fulfilled(value) {
    					try {
    						step(generator.next(value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function rejected(value) {
    					try {
    						step(generator["throw"](value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function step(result) {
    					result.done
    					? resolve(result.value)
    					: adopt(result.value).then(fulfilled, rejected);
    				}

    				step((generator = generator.apply(thisArg, _arguments || [])).next());
    			});
    	};

    	let version;

    	onMount(() => __awaiter(void 0, void 0, void 0, function* () {
    		yield fetch(`${window.location.origin}/version.txt`).then(response => response.text()).then(data => {
    			$$invalidate(0, version = data);
    		});
    	}));

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ __awaiter, onMount, version });

    	$$self.$inject_state = $$props => {
    		if ("__awaiter" in $$props) __awaiter = $$props.__awaiter;
    		if ("version" in $$props) $$invalidate(0, version = $$props.version);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [version];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* services/metadata/frontend/projects-repository/Tile.svelte generated by Svelte v3.32.1 */

    const { console: console_1 } = globals;
    const file$4 = "services/metadata/frontend/projects-repository/Tile.svelte";

    // (19:6) <Link to={`/projects/${projectMetadata.id}`} class="read-more regular-link">
    function create_default_slot_1$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Read more");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(19:6) <Link to={`/projects/${projectMetadata.id}`} class=\\\"read-more regular-link\\\">",
    		ctx
    	});

    	return block;
    }

    // (18:4) <Router>
    function create_default_slot$1(ctx) {
    	let link;
    	let current;

    	link = new Link({
    			props: {
    				to: `/projects/${/*projectMetadata*/ ctx[0].id}`,
    				class: "read-more regular-link",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link_changes = {};
    			if (dirty & /*projectMetadata*/ 1) link_changes.to = `/projects/${/*projectMetadata*/ ctx[0].id}`;

    			if (dirty & /*$$scope*/ 4) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(18:4) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let section;
    	let div0;
    	let h5;
    	let t0_value = /*projectMetadata*/ ctx[0].name + "";
    	let t0;
    	let t1;
    	let div1;
    	let t2_value = /*projectMetadata*/ ctx[0].description + "";
    	let t2;
    	let t3;
    	let div2;
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section = element("section");
    			div0 = element("div");
    			h5 = element("h5");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			div2 = element("div");
    			create_component(router.$$.fragment);
    			attr_dev(h5, "class", "svelte-gkm0u5");
    			add_location(h5, file$4, 13, 4, 402);
    			attr_dev(div0, "class", "header svelte-gkm0u5");
    			add_location(div0, file$4, 12, 2, 379);
    			attr_dev(div1, "class", "content svelte-gkm0u5");
    			add_location(div1, file$4, 15, 2, 447);
    			attr_dev(div2, "class", "footer svelte-gkm0u5");
    			add_location(div2, file$4, 16, 2, 506);
    			attr_dev(section, "class", "svelte-gkm0u5");
    			add_location(section, file$4, 11, 0, 367);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div0);
    			append_dev(div0, h5);
    			append_dev(h5, t0);
    			append_dev(section, t1);
    			append_dev(section, div1);
    			append_dev(div1, t2);
    			append_dev(section, t3);
    			append_dev(section, div2);
    			mount_component(router, div2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*projectMetadata*/ 1) && t0_value !== (t0_value = /*projectMetadata*/ ctx[0].name + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty & /*projectMetadata*/ 1) && t2_value !== (t2_value = /*projectMetadata*/ ctx[0].description + "")) set_data_dev(t2, t2_value);
    			const router_changes = {};

    			if (dirty & /*$$scope, projectMetadata*/ 5) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(router);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Tile", slots, []);
    	
    	let { projectMetadata } = $$props;

    	const setProject = () => {
    		const project = projectMetadata.metadata.find(p => p.type === "http://ns.dasch.swiss/repository#Project");
    		console.log(444444, projectMetadata);
    		currentProject.set(project);
    	};

    	const writable_props = ["projectMetadata"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Tile> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("projectMetadata" in $$props) $$invalidate(0, projectMetadata = $$props.projectMetadata);
    	};

    	$$self.$capture_state = () => ({
    		Router,
    		Link,
    		currentProject,
    		projectMetadata,
    		setProject
    	});

    	$$self.$inject_state = $$props => {
    		if ("projectMetadata" in $$props) $$invalidate(0, projectMetadata = $$props.projectMetadata);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [projectMetadata];
    }

    class Tile extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { projectMetadata: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tile",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*projectMetadata*/ ctx[0] === undefined && !("projectMetadata" in props)) {
    			console_1.warn("<Tile> was created without expected prop 'projectMetadata'");
    		}
    	}

    	get projectMetadata() {
    		throw new Error("<Tile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set projectMetadata(value) {
    		throw new Error("<Tile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* services/metadata/frontend/projects-repository/Pagination.svelte generated by Svelte v3.32.1 */
    const file$5 = "services/metadata/frontend/projects-repository/Pagination.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	child_ctx[5] = i;
    	return child_ctx;
    }

    // (47:4) {#each Array($pagination.totalPages) as _, i}
    function create_each_block$1(ctx) {
    	let button;
    	let t_value = /*i*/ ctx[5] + 1 + "";
    	let t;
    	let button_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "id", (/*i*/ ctx[5] + 1).toString());

    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*i*/ ctx[5] + 1 === /*$pagination*/ ctx[0].currentPage
    			? "active"
    			: "") + " svelte-1e00qp8"));

    			add_location(button, file$5, 47, 6, 1699);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*handlePagination*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$pagination*/ 1 && button_class_value !== (button_class_value = "" + (null_to_empty(/*i*/ ctx[5] + 1 === /*$pagination*/ ctx[0].currentPage
    			? "active"
    			: "") + " svelte-1e00qp8"))) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(47:4) {#each Array($pagination.totalPages) as _, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div3;
    	let div1;
    	let div0;
    	let p;
    	let t0;
    	let span0;
    	let t1_value = /*$pagination*/ ctx[0].currentResultsRange[0] + "";
    	let t1;
    	let t2;
    	let span1;

    	let t3_value = (/*$pagination*/ ctx[0].currentResultsRange[1] > /*$pagination*/ ctx[0].totalCount
    	? /*$pagination*/ ctx[0].totalCount
    	: /*$pagination*/ ctx[0].currentResultsRange[1]) + "";

    	let t3;
    	let t4;
    	let span2;
    	let t5_value = /*$pagination*/ ctx[0].totalCount + "";
    	let t5;
    	let t6;
    	let t7;
    	let div2;
    	let button0;
    	let t8;
    	let button0_disabled_value;
    	let t9;
    	let t10;
    	let button1;
    	let t11;
    	let button1_disabled_value;
    	let mounted;
    	let dispose;
    	let each_value = Array(/*$pagination*/ ctx[0].totalPages);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			p = element("p");
    			t0 = text("Showing\n        ");
    			span0 = element("span");
    			t1 = text(t1_value);
    			t2 = text("\n        to\n        ");
    			span1 = element("span");
    			t3 = text(t3_value);
    			t4 = text("\n        of\n        ");
    			span2 = element("span");
    			t5 = text(t5_value);
    			t6 = text("\n        results");
    			t7 = space();
    			div2 = element("div");
    			button0 = element("button");
    			t8 = text("«");
    			t9 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t10 = space();
    			button1 = element("button");
    			t11 = text("»");
    			add_location(span0, file$5, 29, 8, 966);
    			add_location(span1, file$5, 31, 8, 1035);
    			add_location(span2, file$5, 33, 8, 1191);
    			add_location(p, file$5, 27, 6, 938);
    			add_location(div0, file$5, 26, 4, 926);
    			attr_dev(div1, "class", "stats");
    			add_location(div1, file$5, 25, 2, 902);
    			attr_dev(button0, "id", "first");
    			attr_dev(button0, "title", "First Page");
    			button0.disabled = button0_disabled_value = /*$pagination*/ ctx[0].currentPage === 1;
    			attr_dev(button0, "class", "svelte-1e00qp8");
    			add_location(button0, file$5, 45, 4, 1519);
    			attr_dev(button1, "id", "last");
    			attr_dev(button1, "title", "Last Page");
    			button1.disabled = button1_disabled_value = /*$pagination*/ ctx[0].currentPage === /*$pagination*/ ctx[0].totalPages;
    			attr_dev(button1, "class", "svelte-1e00qp8");
    			add_location(button1, file$5, 49, 4, 1850);
    			attr_dev(div2, "class", "pagination svelte-1e00qp8");
    			add_location(div2, file$5, 44, 2, 1490);
    			attr_dev(div3, "class", "" + (null_to_empty(pagedResults ? "pagination-container" : "hidden") + " svelte-1e00qp8"));
    			add_location(div3, file$5, 24, 0, 837);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			append_dev(div1, div0);
    			append_dev(div0, p);
    			append_dev(p, t0);
    			append_dev(p, span0);
    			append_dev(span0, t1);
    			append_dev(p, t2);
    			append_dev(p, span1);
    			append_dev(span1, t3);
    			append_dev(p, t4);
    			append_dev(p, span2);
    			append_dev(span2, t5);
    			append_dev(p, t6);
    			append_dev(div3, t7);
    			append_dev(div3, div2);
    			append_dev(div2, button0);
    			append_dev(button0, t8);
    			append_dev(div2, t9);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}

    			append_dev(div2, t10);
    			append_dev(div2, button1);
    			append_dev(button1, t11);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*handlePagination*/ ctx[1], false, false, false),
    					listen_dev(button1, "click", /*handlePagination*/ ctx[1], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$pagination*/ 1 && t1_value !== (t1_value = /*$pagination*/ ctx[0].currentResultsRange[0] + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*$pagination*/ 1 && t3_value !== (t3_value = (/*$pagination*/ ctx[0].currentResultsRange[1] > /*$pagination*/ ctx[0].totalCount
    			? /*$pagination*/ ctx[0].totalCount
    			: /*$pagination*/ ctx[0].currentResultsRange[1]) + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*$pagination*/ 1 && t5_value !== (t5_value = /*$pagination*/ ctx[0].totalCount + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*$pagination*/ 1 && button0_disabled_value !== (button0_disabled_value = /*$pagination*/ ctx[0].currentPage === 1)) {
    				prop_dev(button0, "disabled", button0_disabled_value);
    			}

    			if (dirty & /*$pagination, handlePagination*/ 3) {
    				each_value = Array(/*$pagination*/ ctx[0].totalPages);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div2, t10);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*$pagination*/ 1 && button1_disabled_value !== (button1_disabled_value = /*$pagination*/ ctx[0].currentPage === /*$pagination*/ ctx[0].totalPages)) {
    				prop_dev(button1, "disabled", button1_disabled_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $pagination;
    	let $query;
    	validate_store(pagination, "pagination");
    	component_subscribe($$self, pagination, $$value => $$invalidate(0, $pagination = $$value));
    	validate_store(query, "query");
    	component_subscribe($$self, query, $$value => $$invalidate(2, $query = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Pagination", slots, []);

    	let handlePagination = event => {
    		const id = event.target.id;

    		if ($pagination.currentPage === Number(id)) {
    			return;
    		} else if (id === "first") {
    			set_store_value(pagination, $pagination.currentPage = 1, $pagination);
    		} else if (id === "last") {
    			set_store_value(pagination, $pagination.currentPage = $pagination.totalPages, $pagination);
    		} else {
    			set_store_value(pagination, $pagination.currentPage = Number(id), $pagination);
    		}

    		document.querySelector(".active").classList.remove("active");
    		document.getElementById($pagination.currentPage.toString()).classList.add("active");
    		navigate(`projects?_page=${$pagination.currentPage}&_limit=9`);
    		getProjectsMetadata($pagination.currentPage, $query);
    		window.scrollTo(0, 0);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Pagination> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		navigate,
    		getProjectsMetadata,
    		pagedResults,
    		pagination,
    		query,
    		handlePagination,
    		$pagination,
    		$query
    	});

    	$$self.$inject_state = $$props => {
    		if ("handlePagination" in $$props) $$invalidate(1, handlePagination = $$props.handlePagination);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$pagination, handlePagination];
    }

    class Pagination extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pagination",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* services/metadata/frontend/Snackbar.svelte generated by Svelte v3.32.1 */
    const file$6 = "services/metadata/frontend/Snackbar.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let t_value = /*$handleSnackbar*/ ctx[0].message + "";
    	let t;
    	let div_intro;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "svelte-1r3lx7k");
    			add_location(div, file$6, 17, 0, 425);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$handleSnackbar*/ 1 && t_value !== (t_value = /*$handleSnackbar*/ ctx[0].message + "")) set_data_dev(t, t_value);
    		},
    		i: function intro(local) {
    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fade, { duration: 250 });
    					div_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let $handleSnackbar;
    	validate_store(handleSnackbar, "handleSnackbar");
    	component_subscribe($$self, handleSnackbar, $$value => $$invalidate(0, $handleSnackbar = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Snackbar", slots, []);

    	onMount(() => {
    		if ($handleSnackbar.isSnackbar) {
    			setTimeout(
    				() => {
    					set_store_value(handleSnackbar, $handleSnackbar.isSnackbar = false, $handleSnackbar);
    				},
    				3000
    			);
    		}
    	});

    	onDestroy(() => {
    		if ($handleSnackbar.isSnackbar) {
    			set_store_value(handleSnackbar, $handleSnackbar.isSnackbar = false, $handleSnackbar);
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Snackbar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onDestroy,
    		onMount,
    		fade,
    		handleSnackbar,
    		$handleSnackbar
    	});

    	return [$handleSnackbar];
    }

    class Snackbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Snackbar",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* services/metadata/frontend/projects-repository/ProjectsRepository.svelte generated by Svelte v3.32.1 */

    const { console: console_1$1 } = globals;
    const file$7 = "services/metadata/frontend/projects-repository/ProjectsRepository.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (45:0) {#if $handleSnackbar.isSnackbar}
    function create_if_block_2(ctx) {
    	let div;
    	let switch_instance;
    	let current;
    	var switch_value = Snackbar;

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div, "class", "svelte-1s0xqf8");
    			add_location(div, file$7, 45, 2, 1919);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = Snackbar)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, null);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (switch_instance) destroy_component(switch_instance);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(45:0) {#if $handleSnackbar.isSnackbar}",
    		ctx
    	});

    	return block;
    }

    // (57:4) {:else}
    function create_else_block$1(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*message*/ ctx[0]);
    			attr_dev(p, "class", "svelte-1s0xqf8");
    			add_location(p, file$7, 57, 6, 2207);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*message*/ 1) set_data_dev(t, /*message*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(57:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (53:4) {#if $pagedResults && $pagedResults.length}
    function create_if_block_1$1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*$pagedResults*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$pagedResults*/ 2) {
    				each_value = /*$pagedResults*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(53:4) {#if $pagedResults && $pagedResults.length}",
    		ctx
    	});

    	return block;
    }

    // (54:6) {#each $pagedResults as project}
    function create_each_block$2(ctx) {
    	let tile;
    	let current;

    	tile = new Tile({
    			props: { projectMetadata: /*project*/ ctx[4] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tile.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tile, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tile_changes = {};
    			if (dirty & /*$pagedResults*/ 2) tile_changes.projectMetadata = /*project*/ ctx[4];
    			tile.$set(tile_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tile.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tile.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tile, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(54:6) {#each $pagedResults as project}",
    		ctx
    	});

    	return block;
    }

    // (61:2) {#if $pagedResults && $pagedResults.length}
    function create_if_block$3(ctx) {
    	let pagination;
    	let current;
    	pagination = new Pagination({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(pagination.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pagination, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pagination.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pagination.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pagination, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(61:2) {#if $pagedResults && $pagedResults.length}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let nav;
    	let div0;
    	let category;
    	let t0;
    	let t1;
    	let main;
    	let div1;
    	let current_block_type_index;
    	let if_block1;
    	let t2;
    	let main_intro;
    	let current;
    	category = new Category({ $$inline: true });
    	let if_block0 = /*$handleSnackbar*/ ctx[2].isSnackbar && create_if_block_2(ctx);
    	const if_block_creators = [create_if_block_1$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$pagedResults*/ ctx[1] && /*$pagedResults*/ ctx[1].length) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block2 = /*$pagedResults*/ ctx[1] && /*$pagedResults*/ ctx[1].length && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div0 = element("div");
    			create_component(category.$$.fragment);
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			main = element("main");
    			div1 = element("div");
    			if_block1.c();
    			t2 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(div0, "class", "category-container hidden m-inline-block svelte-1s0xqf8");
    			add_location(div0, file$7, 39, 2, 1795);
    			attr_dev(nav, "class", "svelte-1s0xqf8");
    			add_location(nav, file$7, 38, 0, 1787);
    			attr_dev(div1, "class", "tile-container svelte-1s0xqf8");
    			add_location(div1, file$7, 51, 2, 2019);
    			attr_dev(main, "class", "svelte-1s0xqf8");
    			add_location(main, file$7, 50, 0, 1982);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div0);
    			mount_component(category, div0, null);
    			insert_dev(target, t0, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div1);
    			if_blocks[current_block_type_index].m(div1, null);
    			append_dev(main, t2);
    			if (if_block2) if_block2.m(main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$handleSnackbar*/ ctx[2].isSnackbar) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*$handleSnackbar*/ 4) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t1.parentNode, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(div1, null);
    			}

    			if (/*$pagedResults*/ ctx[1] && /*$pagedResults*/ ctx[1].length) {
    				if (if_block2) {
    					if (dirty & /*$pagedResults*/ 2) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$3(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(main, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(category.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);

    			if (!main_intro) {
    				add_render_callback(() => {
    					main_intro = create_in_transition(main, fade, { duration: 200 });
    					main_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(category.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_component(category);
    			if (detaching) detach_dev(t0);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(main);
    			if_blocks[current_block_type_index].d();
    			if (if_block2) if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $pagedResults;
    	let $handleSnackbar;
    	validate_store(pagedResults, "pagedResults");
    	component_subscribe($$self, pagedResults, $$value => $$invalidate(1, $pagedResults = $$value));
    	validate_store(handleSnackbar, "handleSnackbar");
    	component_subscribe($$self, handleSnackbar, $$value => $$invalidate(2, $handleSnackbar = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ProjectsRepository", slots, []);

    	var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    		function adopt(value) {
    			return value instanceof P
    			? value
    			: new P(function (resolve) {
    						resolve(value);
    					});
    		}

    		return new (P || (P = Promise))(function (resolve, reject) {
    				function fulfilled(value) {
    					try {
    						step(generator.next(value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function rejected(value) {
    					try {
    						step(generator["throw"](value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function step(result) {
    					result.done
    					? resolve(result.value)
    					: adopt(result.value).then(fulfilled, rejected);
    				}

    				step((generator = generator.apply(thisArg, _arguments || [])).next());
    			});
    	};

    	let message = "Loading...";

    	setTimeout(
    		() => {
    			const noData = "No data retrived. Please check the connection and retry.";
    			const noProject = "No projects found.";

    			$$invalidate(0, message = $pagedResults && $pagedResults.length
    			? noData
    			: noProject);
    		},
    		3000
    	);

    	onMount(() => __awaiter(void 0, void 0, void 0, function* () {
    		const searchUri = window.location.search;
    		const params = new URLSearchParams(searchUri);
    		const page = Number(params.get("_page"));
    		const query = params.get("q");
    		console.log(searchUri, query, page, params.get("_limit"));

    		if (!$pagedResults && !searchUri) {
    			yield getProjectsMetadata(1);
    		} else {
    			yield getProjectsMetadata(page, query);
    		}
    	}));

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<ProjectsRepository> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		__awaiter,
    		Tile,
    		Category,
    		onMount,
    		Pagination,
    		getProjectsMetadata,
    		handleSnackbar,
    		pagedResults,
    		fade,
    		Snackbar,
    		message,
    		$pagedResults,
    		$handleSnackbar
    	});

    	$$self.$inject_state = $$props => {
    		if ("__awaiter" in $$props) __awaiter = $$props.__awaiter;
    		if ("message" in $$props) $$invalidate(0, message = $$props.message);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	 document.title = "DaSCH Metadata Browser";
    	return [message, $pagedResults, $handleSnackbar];
    }

    class ProjectsRepository extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProjectsRepository",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* services/metadata/frontend/project-page/ProjectWidget.svelte generated by Svelte v3.32.1 */
    const file$8 = "services/metadata/frontend/project-page/ProjectWidget.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	return child_ctx;
    }

    function get_each_context_5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[21] = list[i];
    	return child_ctx;
    }

    function get_each_context_6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[24] = list[i];
    	return child_ctx;
    }

    // (32:0) {#if Array.isArray($currentProject?.discipline)}
    function create_if_block_18(ctx) {
    	let each_1_anchor;
    	let each_value_6 = /*$currentProject*/ ctx[0]?.discipline;
    	validate_each_argument(each_value_6);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_6.length; i += 1) {
    		each_blocks[i] = create_each_block_6(get_each_context_6(ctx, each_value_6, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*truncateString, $currentProject*/ 9) {
    				each_value_6 = /*$currentProject*/ ctx[0]?.discipline;
    				validate_each_argument(each_value_6);
    				let i;

    				for (i = 0; i < each_value_6.length; i += 1) {
    					const child_ctx = get_each_context_6(ctx, each_value_6, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_6.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_18.name,
    		type: "if",
    		source: "(32:0) {#if Array.isArray($currentProject?.discipline)}",
    		ctx
    	});

    	return block;
    }

    // (42:4) {:else}
    function create_else_block_5(ctx) {
    	let a;
    	let t_value = /*d*/ ctx[24].name + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "class", "data external-link svelte-oyq19y");
    			attr_dev(a, "href", a_href_value = /*d*/ ctx[24].url);
    			attr_dev(a, "target", "_");
    			add_location(a, file$8, 42, 6, 1486);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentProject*/ 1 && t_value !== (t_value = /*d*/ ctx[24].name + "")) set_data_dev(t, t_value);

    			if (dirty & /*$currentProject*/ 1 && a_href_value !== (a_href_value = /*d*/ ctx[24].url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_5.name,
    		type: "else",
    		source: "(42:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (34:4) {#if typeof d === "string"}
    function create_if_block_19(ctx) {
    	let show_if;
    	let show_if_1;
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (show_if == null || dirty & /*$currentProject*/ 1) show_if = !!/*d*/ ctx[24].split(" ")[0].match(/^[0-9]*$/);
    		if (show_if) return create_if_block_20;
    		if (show_if_1 == null || dirty & /*$currentProject*/ 1) show_if_1 = !!/*d*/ ctx[24].match("http");
    		if (show_if_1) return create_if_block_21;
    		return create_else_block_4;
    	}

    	let current_block_type = select_block_type_1(ctx, -1);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_19.name,
    		type: "if",
    		source: "(34:4) {#if typeof d === \\\"string\\\"}",
    		ctx
    	});

    	return block;
    }

    // (39:6) {:else}
    function create_else_block_4(ctx) {
    	let div;
    	let t_value = /*d*/ ctx[24] + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "data svelte-oyq19y");
    			add_location(div, file$8, 39, 8, 1428);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentProject*/ 1 && t_value !== (t_value = /*d*/ ctx[24] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_4.name,
    		type: "else",
    		source: "(39:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (37:32) 
    function create_if_block_21(ctx) {
    	let a;
    	let t_value = /*truncateString*/ ctx[3](/*d*/ ctx[24]) + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "class", "data external-link svelte-oyq19y");
    			attr_dev(a, "href", a_href_value = /*d*/ ctx[24]);
    			attr_dev(a, "target", "_");
    			add_location(a, file$8, 37, 8, 1334);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentProject*/ 1 && t_value !== (t_value = /*truncateString*/ ctx[3](/*d*/ ctx[24]) + "")) set_data_dev(t, t_value);

    			if (dirty & /*$currentProject*/ 1 && a_href_value !== (a_href_value = /*d*/ ctx[24])) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_21.name,
    		type: "if",
    		source: "(37:32) ",
    		ctx
    	});

    	return block;
    }

    // (35:6) {#if d.split(" ")[0].match(/^[0-9]*$/)}
    function create_if_block_20(ctx) {
    	let a;
    	let t_value = /*truncateString*/ ctx[3](/*d*/ ctx[24]) + "";
    	let t;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "class", "data external-link svelte-oyq19y");
    			attr_dev(a, "href", "http://www.snf.ch/SiteCollectionDocuments/allg_disziplinenliste.pdf");
    			attr_dev(a, "target", "_");
    			add_location(a, file$8, 35, 8, 1157);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentProject*/ 1 && t_value !== (t_value = /*truncateString*/ ctx[3](/*d*/ ctx[24]) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_20.name,
    		type: "if",
    		source: "(35:6) {#if d.split(\\\" \\\")[0].match(/^[0-9]*$/)}",
    		ctx
    	});

    	return block;
    }

    // (33:2) {#each $currentProject?.discipline as d}
    function create_each_block_6(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (typeof /*d*/ ctx[24] === "string") return create_if_block_19;
    		return create_else_block_5;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_6.name,
    		type: "each",
    		source: "(33:2) {#each $currentProject?.discipline as d}",
    		ctx
    	});

    	return block;
    }

    // (49:0) {#if Array.isArray($currentProject?.temporalCoverage)}
    function create_if_block_16(ctx) {
    	let each_1_anchor;
    	let each_value_5 = /*$currentProject*/ ctx[0]?.temporalCoverage;
    	validate_each_argument(each_value_5);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		each_blocks[i] = create_each_block_5(get_each_context_5(ctx, each_value_5, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentProject, truncateString*/ 9) {
    				each_value_5 = /*$currentProject*/ ctx[0]?.temporalCoverage;
    				validate_each_argument(each_value_5);
    				let i;

    				for (i = 0; i < each_value_5.length; i += 1) {
    					const child_ctx = get_each_context_5(ctx, each_value_5, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_5.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_16.name,
    		type: "if",
    		source: "(49:0) {#if Array.isArray($currentProject?.temporalCoverage)}",
    		ctx
    	});

    	return block;
    }

    // (53:4) {:else}
    function create_else_block_3(ctx) {
    	let a;
    	let t_value = /*truncateString*/ ctx[3](/*t*/ ctx[21].name) + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "class", "data external-link svelte-oyq19y");
    			attr_dev(a, "href", a_href_value = /*t*/ ctx[21].url);
    			attr_dev(a, "target", "_");
    			add_location(a, file$8, 53, 6, 1807);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentProject*/ 1 && t_value !== (t_value = /*truncateString*/ ctx[3](/*t*/ ctx[21].name) + "")) set_data_dev(t, t_value);

    			if (dirty & /*$currentProject*/ 1 && a_href_value !== (a_href_value = /*t*/ ctx[21].url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_3.name,
    		type: "else",
    		source: "(53:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (51:4) {#if typeof t === "string"}
    function create_if_block_17(ctx) {
    	let div;
    	let t_value = /*t*/ ctx[21] + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "data svelte-oyq19y");
    			add_location(div, file$8, 51, 6, 1761);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentProject*/ 1 && t_value !== (t_value = /*t*/ ctx[21] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_17.name,
    		type: "if",
    		source: "(51:4) {#if typeof t === \\\"string\\\"}",
    		ctx
    	});

    	return block;
    }

    // (50:2) {#each $currentProject?.temporalCoverage as t}
    function create_each_block_5(ctx) {
    	let if_block_anchor;

    	function select_block_type_2(ctx, dirty) {
    		if (typeof /*t*/ ctx[21] === "string") return create_if_block_17;
    		return create_else_block_3;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_5.name,
    		type: "each",
    		source: "(50:2) {#each $currentProject?.temporalCoverage as t}",
    		ctx
    	});

    	return block;
    }

    // (60:0) {#if Array.isArray($currentProject?.spatialCoverage)}
    function create_if_block_14(ctx) {
    	let each_1_anchor;
    	let each_value_4 = /*$currentProject*/ ctx[0]?.spatialCoverage;
    	validate_each_argument(each_value_4);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentProject, truncateString, handleSpatialCoverageName*/ 13) {
    				each_value_4 = /*$currentProject*/ ctx[0]?.spatialCoverage;
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_4.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_14.name,
    		type: "if",
    		source: "(60:0) {#if Array.isArray($currentProject?.spatialCoverage)}",
    		ctx
    	});

    	return block;
    }

    // (65:4) {:else}
    function create_else_block_2(ctx) {
    	let a;
    	let t_value = /*truncateString*/ ctx[3](/*handleSpatialCoverageName*/ ctx[2](/*s*/ ctx[18].place.url)) + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "class", "data external-link svelte-oyq19y");
    			set_style(a, "text-transform", "capitalize");
    			attr_dev(a, "href", a_href_value = /*s*/ ctx[18].place.url);
    			attr_dev(a, "target", "_");
    			add_location(a, file$8, 65, 6, 2341);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentProject*/ 1 && t_value !== (t_value = /*truncateString*/ ctx[3](/*handleSpatialCoverageName*/ ctx[2](/*s*/ ctx[18].place.url)) + "")) set_data_dev(t, t_value);

    			if (dirty & /*$currentProject*/ 1 && a_href_value !== (a_href_value = /*s*/ ctx[18].place.url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(65:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (63:4) {#if s.place.name !== "Geonames"}
    function create_if_block_15(ctx) {
    	let a;
    	let t_value = /*truncateString*/ ctx[3](/*s*/ ctx[18].place.name) + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "class", "data external-link svelte-oyq19y");
    			set_style(a, "text-transform", "capitalize");
    			attr_dev(a, "href", a_href_value = /*s*/ ctx[18].place.url);
    			attr_dev(a, "target", "_");
    			add_location(a, file$8, 63, 6, 2195);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentProject*/ 1 && t_value !== (t_value = /*truncateString*/ ctx[3](/*s*/ ctx[18].place.name) + "")) set_data_dev(t, t_value);

    			if (dirty & /*$currentProject*/ 1 && a_href_value !== (a_href_value = /*s*/ ctx[18].place.url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_15.name,
    		type: "if",
    		source: "(63:4) {#if s.place.name !== \\\"Geonames\\\"}",
    		ctx
    	});

    	return block;
    }

    // (61:2) {#each $currentProject?.spatialCoverage as s}
    function create_each_block_4(ctx) {
    	let if_block_anchor;

    	function select_block_type_3(ctx, dirty) {
    		if (/*s*/ ctx[18].place.name !== "Geonames") return create_if_block_15;
    		return create_else_block_2;
    	}

    	let current_block_type = select_block_type_3(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_3(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(61:2) {#each $currentProject?.spatialCoverage as s}",
    		ctx
    	});

    	return block;
    }

    // (74:0) {#if $currentProject?.endDate}
    function create_if_block_13(ctx) {
    	let div0;
    	let t1;
    	let div1;
    	let t2_value = /*$currentProject*/ ctx[0]?.endDate + "";
    	let t2;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = "End date";
    			t1 = space();
    			div1 = element("div");
    			t2 = text(t2_value);
    			attr_dev(div0, "class", "label svelte-oyq19y");
    			add_location(div0, file$8, 74, 0, 2643);
    			attr_dev(div1, "class", "data svelte-oyq19y");
    			add_location(div1, file$8, 75, 0, 2675);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentProject*/ 1 && t2_value !== (t2_value = /*$currentProject*/ ctx[0]?.endDate + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13.name,
    		type: "if",
    		source: "(74:0) {#if $currentProject?.endDate}",
    		ctx
    	});

    	return block;
    }

    // (80:0) {#if Array.isArray($currentProject?.funder)}
    function create_if_block_10(ctx) {
    	let each_1_anchor;
    	let each_value_3 = /*$currentProject*/ ctx[0]?.funder;
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*findObjectById, $currentProject*/ 3) {
    				each_value_3 = /*$currentProject*/ ctx[0]?.funder;
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(80:0) {#if Array.isArray($currentProject?.funder)}",
    		ctx
    	});

    	return block;
    }

    // (84:92) 
    function create_if_block_12(ctx) {
    	let div;
    	let t_value = /*findObjectById*/ ctx[1](/*f*/ ctx[15].id)?.name.join(", ") + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "data svelte-oyq19y");
    			add_location(div, file$8, 84, 6, 3144);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentProject*/ 1 && t_value !== (t_value = /*findObjectById*/ ctx[1](/*f*/ ctx[15].id)?.name.join(", ") + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(84:92) ",
    		ctx
    	});

    	return block;
    }

    // (82:4) {#if findObjectById(f.id).type === "http://ns.dasch.swiss/repository#Person"}
    function create_if_block_11(ctx) {
    	let div;
    	let t0_value = /*findObjectById*/ ctx[1](/*f*/ ctx[15].id)?.givenName.split(";").join(" ") + "";
    	let t0;
    	let t1;
    	let t2_value = /*findObjectById*/ ctx[1](/*f*/ ctx[15].id)?.familyName + "";
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			t2 = text(t2_value);
    			attr_dev(div, "class", "data svelte-oyq19y");
    			add_location(div, file$8, 82, 6, 2933);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentProject*/ 1 && t0_value !== (t0_value = /*findObjectById*/ ctx[1](/*f*/ ctx[15].id)?.givenName.split(";").join(" ") + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*$currentProject*/ 1 && t2_value !== (t2_value = /*findObjectById*/ ctx[1](/*f*/ ctx[15].id)?.familyName + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(82:4) {#if findObjectById(f.id).type === \\\"http://ns.dasch.swiss/repository#Person\\\"}",
    		ctx
    	});

    	return block;
    }

    // (81:2) {#each $currentProject?.funder as f}
    function create_each_block_3(ctx) {
    	let show_if;
    	let show_if_1;
    	let if_block_anchor;

    	function select_block_type_4(ctx, dirty) {
    		if (show_if == null || dirty & /*$currentProject*/ 1) show_if = !!(/*findObjectById*/ ctx[1](/*f*/ ctx[15].id).type === "http://ns.dasch.swiss/repository#Person");
    		if (show_if) return create_if_block_11;
    		if (show_if_1 == null || dirty & /*$currentProject*/ 1) show_if_1 = !!(/*findObjectById*/ ctx[1](/*f*/ ctx[15].id).type === "http://ns.dasch.swiss/repository#Organization");
    		if (show_if_1) return create_if_block_12;
    	}

    	let current_block_type = select_block_type_4(ctx, -1);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_4(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(81:2) {#each $currentProject?.funder as f}",
    		ctx
    	});

    	return block;
    }

    // (90:0) {#if $currentProject?.grant && Array.isArray($currentProject?.grant)}
    function create_if_block_7(ctx) {
    	let div;
    	let t1;
    	let each_1_anchor;
    	let each_value_2 = /*$currentProject*/ ctx[0]?.grant;
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Grant";
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			attr_dev(div, "class", "label svelte-oyq19y");
    			add_location(div, file$8, 90, 0, 3303);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*findObjectById, $currentProject*/ 3) {
    				each_value_2 = /*$currentProject*/ ctx[0]?.grant;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t1);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(90:0) {#if $currentProject?.grant && Array.isArray($currentProject?.grant)}",
    		ctx
    	});

    	return block;
    }

    // (97:4) {:else}
    function create_else_block_1(ctx) {
    	let span;
    	let t_value = /*findObjectById*/ ctx[1](/*findObjectById*/ ctx[1](/*g*/ ctx[12].id)?.funder[0].id)?.name.join(", ") + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "data svelte-oyq19y");
    			add_location(span, file$8, 97, 6, 3683);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentProject*/ 1 && t_value !== (t_value = /*findObjectById*/ ctx[1](/*findObjectById*/ ctx[1](/*g*/ ctx[12].id)?.funder[0].id)?.name.join(", ") + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(97:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (95:43) 
    function create_if_block_9(ctx) {
    	let span;
    	let t_value = /*findObjectById*/ ctx[1](/*g*/ ctx[12].id)?.number + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "data svelte-oyq19y");
    			add_location(span, file$8, 95, 6, 3608);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentProject*/ 1 && t_value !== (t_value = /*findObjectById*/ ctx[1](/*g*/ ctx[12].id)?.number + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(95:43) ",
    		ctx
    	});

    	return block;
    }

    // (93:4) {#if findObjectById(g.id)?.number && findObjectById(g.id)?.url}
    function create_if_block_8(ctx) {
    	let a;
    	let t_value = /*findObjectById*/ ctx[1](/*g*/ ctx[12].id)?.number + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "class", "data external-link svelte-oyq19y");
    			attr_dev(a, "href", a_href_value = /*findObjectById*/ ctx[1](/*g*/ ctx[12].id)?.url[0].url);
    			attr_dev(a, "target", "_");
    			add_location(a, file$8, 93, 6, 3444);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentProject*/ 1 && t_value !== (t_value = /*findObjectById*/ ctx[1](/*g*/ ctx[12].id)?.number + "")) set_data_dev(t, t_value);

    			if (dirty & /*$currentProject*/ 1 && a_href_value !== (a_href_value = /*findObjectById*/ ctx[1](/*g*/ ctx[12].id)?.url[0].url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(93:4) {#if findObjectById(g.id)?.number && findObjectById(g.id)?.url}",
    		ctx
    	});

    	return block;
    }

    // (92:2) {#each $currentProject?.grant as g}
    function create_each_block_2(ctx) {
    	let show_if;
    	let show_if_1;
    	let if_block_anchor;

    	function select_block_type_5(ctx, dirty) {
    		if (show_if == null || dirty & /*$currentProject*/ 1) show_if = !!(/*findObjectById*/ ctx[1](/*g*/ ctx[12].id)?.number && /*findObjectById*/ ctx[1](/*g*/ ctx[12].id)?.url);
    		if (show_if) return create_if_block_8;
    		if (show_if_1 == null || dirty & /*$currentProject*/ 1) show_if_1 = !!/*findObjectById*/ ctx[1](/*g*/ ctx[12].id)?.number;
    		if (show_if_1) return create_if_block_9;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type_5(ctx, -1);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_5(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(92:2) {#each $currentProject?.grant as g}",
    		ctx
    	});

    	return block;
    }

    // (103:0) {#if $currentProject?.contactPoint}
    function create_if_block_2$1(ctx) {
    	let div;
    	let t1;
    	let show_if_2 = /*findObjectById*/ ctx[1](/*$currentProject*/ ctx[0]?.contactPoint[0].id)?.givenName && /*findObjectById*/ ctx[1](/*$currentProject*/ ctx[0]?.contactPoint[0].id)?.familyName;
    	let t2;
    	let show_if_1 = Array.isArray(/*findObjectById*/ ctx[1](/*$currentProject*/ ctx[0]?.contactPoint[0].id)?.memberOf);
    	let t3;
    	let show_if = /*findObjectById*/ ctx[1](/*$currentProject*/ ctx[0]?.contactPoint[0].id)?.email;
    	let if_block2_anchor;
    	let if_block0 = show_if_2 && create_if_block_6(ctx);
    	let if_block1 = show_if_1 && create_if_block_5(ctx);
    	let if_block2 = show_if && create_if_block_3(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Contact";
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    			attr_dev(div, "class", "label svelte-oyq19y");
    			add_location(div, file$8, 103, 2, 3844);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t3, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentProject*/ 1) show_if_2 = /*findObjectById*/ ctx[1](/*$currentProject*/ ctx[0]?.contactPoint[0].id)?.givenName && /*findObjectById*/ ctx[1](/*$currentProject*/ ctx[0]?.contactPoint[0].id)?.familyName;

    			if (show_if_2) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_6(ctx);
    					if_block0.c();
    					if_block0.m(t2.parentNode, t2);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*$currentProject*/ 1) show_if_1 = Array.isArray(/*findObjectById*/ ctx[1](/*$currentProject*/ ctx[0]?.contactPoint[0].id)?.memberOf);

    			if (show_if_1) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_5(ctx);
    					if_block1.c();
    					if_block1.m(t3.parentNode, t3);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*$currentProject*/ 1) show_if = /*findObjectById*/ ctx[1](/*$currentProject*/ ctx[0]?.contactPoint[0].id)?.email;

    			if (show_if) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_3(ctx);
    					if_block2.c();
    					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t1);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t3);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(103:0) {#if $currentProject?.contactPoint}",
    		ctx
    	});

    	return block;
    }

    // (105:2) {#if findObjectById($currentProject?.contactPoint[0].id)?.givenName && findObjectById($currentProject?.contactPoint[0].id)?.familyName}
    function create_if_block_6(ctx) {
    	let div;
    	let t0_value = /*findObjectById*/ ctx[1](/*$currentProject*/ ctx[0]?.contactPoint[0].id)?.givenName?.split(";").join(" ") + "";
    	let t0;
    	let t1;
    	let t2_value = /*findObjectById*/ ctx[1](/*$currentProject*/ ctx[0]?.contactPoint[0].id)?.familyName + "";
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			t2 = text(t2_value);
    			attr_dev(div, "id", "contact");
    			attr_dev(div, "class", "data svelte-oyq19y");
    			add_location(div, file$8, 105, 4, 4017);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentProject*/ 1 && t0_value !== (t0_value = /*findObjectById*/ ctx[1](/*$currentProject*/ ctx[0]?.contactPoint[0].id)?.givenName?.split(";").join(" ") + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*$currentProject*/ 1 && t2_value !== (t2_value = /*findObjectById*/ ctx[1](/*$currentProject*/ ctx[0]?.contactPoint[0].id)?.familyName + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(105:2) {#if findObjectById($currentProject?.contactPoint[0].id)?.givenName && findObjectById($currentProject?.contactPoint[0].id)?.familyName}",
    		ctx
    	});

    	return block;
    }

    // (108:2) {#if Array.isArray(findObjectById($currentProject?.contactPoint[0].id)?.memberOf)}
    function create_if_block_5(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*findObjectById*/ ctx[1](/*$currentProject*/ ctx[0]?.contactPoint[0].id)?.memberOf;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*findObjectById, $currentProject*/ 3) {
    				each_value_1 = /*findObjectById*/ ctx[1](/*$currentProject*/ ctx[0]?.contactPoint[0].id)?.memberOf;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(108:2) {#if Array.isArray(findObjectById($currentProject?.contactPoint[0].id)?.memberOf)}",
    		ctx
    	});

    	return block;
    }

    // (109:4) {#each findObjectById($currentProject?.contactPoint[0].id)?.memberOf as o}
    function create_each_block_1$1(ctx) {
    	let span;
    	let t_value = /*findObjectById*/ ctx[1](/*o*/ ctx[9].id).name[0] + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			add_location(span, file$8, 109, 6, 4381);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentProject*/ 1 && t_value !== (t_value = /*findObjectById*/ ctx[1](/*o*/ ctx[9].id).name[0] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(109:4) {#each findObjectById($currentProject?.contactPoint[0].id)?.memberOf as o}",
    		ctx
    	});

    	return block;
    }

    // (113:2) {#if findObjectById($currentProject?.contactPoint[0].id)?.email}
    function create_if_block_3(ctx) {
    	let show_if;
    	let if_block_anchor;

    	function select_block_type_6(ctx, dirty) {
    		if (show_if == null || dirty & /*$currentProject*/ 1) show_if = !!Array.isArray(/*findObjectById*/ ctx[1](/*$currentProject*/ ctx[0]?.contactPoint[0].id)?.email);
    		if (show_if) return create_if_block_4;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type_6(ctx, -1);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_6(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(113:2) {#if findObjectById($currentProject?.contactPoint[0].id)?.email}",
    		ctx
    	});

    	return block;
    }

    // (116:4) {:else}
    function create_else_block$2(ctx) {
    	let a;
    	let t_value = /*findObjectById*/ ctx[1](/*$currentProject*/ ctx[0]?.contactPoint[0].id)?.email + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "class", "data email svelte-oyq19y");
    			attr_dev(a, "href", a_href_value = "mailto:" + /*findObjectById*/ ctx[1](/*$currentProject*/ ctx[0]?.contactPoint[0].id)?.email);
    			add_location(a, file$8, 116, 6, 4788);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentProject*/ 1 && t_value !== (t_value = /*findObjectById*/ ctx[1](/*$currentProject*/ ctx[0]?.contactPoint[0].id)?.email + "")) set_data_dev(t, t_value);

    			if (dirty & /*$currentProject*/ 1 && a_href_value !== (a_href_value = "mailto:" + /*findObjectById*/ ctx[1](/*$currentProject*/ ctx[0]?.contactPoint[0].id)?.email)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(116:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (114:4) {#if Array.isArray(findObjectById($currentProject?.contactPoint[0].id)?.email)}
    function create_if_block_4(ctx) {
    	let a;
    	let t_value = /*findObjectById*/ ctx[1](/*$currentProject*/ ctx[0]?.contactPoint[0].id)?.email[0] + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "class", "data email svelte-oyq19y");
    			attr_dev(a, "href", a_href_value = "mailto:" + /*findObjectById*/ ctx[1](/*$currentProject*/ ctx[0]?.contactPoint[0].id)?.email[0]);
    			add_location(a, file$8, 114, 6, 4602);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentProject*/ 1 && t_value !== (t_value = /*findObjectById*/ ctx[1](/*$currentProject*/ ctx[0]?.contactPoint[0].id)?.email[0] + "")) set_data_dev(t, t_value);

    			if (dirty & /*$currentProject*/ 1 && a_href_value !== (a_href_value = "mailto:" + /*findObjectById*/ ctx[1](/*$currentProject*/ ctx[0]?.contactPoint[0].id)?.email[0])) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(114:4) {#if Array.isArray(findObjectById($currentProject?.contactPoint[0].id)?.email)}",
    		ctx
    	});

    	return block;
    }

    // (123:0) {#if Array.isArray($currentProject?.url)}
    function create_if_block_1$2(ctx) {
    	let each_1_anchor;
    	let each_value = /*$currentProject*/ ctx[0]?.url;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentProject, truncateString*/ 9) {
    				each_value = /*$currentProject*/ ctx[0]?.url;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(123:0) {#if Array.isArray($currentProject?.url)}",
    		ctx
    	});

    	return block;
    }

    // (124:2) {#each $currentProject?.url as url}
    function create_each_block$3(ctx) {
    	let a;
    	let t_value = /*truncateString*/ ctx[3](/*url*/ ctx[6].name) + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "class", "data external-link svelte-oyq19y");
    			attr_dev(a, "href", a_href_value = /*url*/ ctx[6].url);
    			attr_dev(a, "target", "_");
    			add_location(a, file$8, 124, 4, 5098);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentProject*/ 1 && t_value !== (t_value = /*truncateString*/ ctx[3](/*url*/ ctx[6].name) + "")) set_data_dev(t, t_value);

    			if (dirty & /*$currentProject*/ 1 && a_href_value !== (a_href_value = /*url*/ ctx[6].url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(124:2) {#each $currentProject?.url as url}",
    		ctx
    	});

    	return block;
    }

    // (129:0) {#if $currentProject}
    function create_if_block$4(ctx) {
    	let div;
    	let t1;
    	let span;
    	let t2_value = /*$currentProject*/ ctx[0]?.keywords.join(", ") + "";
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Keywords";
    			t1 = space();
    			span = element("span");
    			t2 = text(t2_value);
    			attr_dev(div, "class", "label svelte-oyq19y");
    			add_location(div, file$8, 129, 2, 5224);
    			attr_dev(span, "class", "keyword svelte-oyq19y");
    			add_location(span, file$8, 130, 2, 5258);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, span, anchor);
    			append_dev(span, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentProject*/ 1 && t2_value !== (t2_value = /*$currentProject*/ ctx[0]?.keywords.join(", ") + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(129:0) {#if $currentProject}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div0;
    	let t1;
    	let div1;
    	let t2_value = /*$currentProject*/ ctx[0]?.shortcode + "";
    	let t2;
    	let t3;
    	let div2;
    	let t5;
    	let div3;

    	let t6_value = ((/*$currentProject*/ ctx[0]?.dataManagementPlan)
    	? "available"
    	: "unavailable") + "";

    	let t6;
    	let t7;
    	let div4;
    	let t9;
    	let show_if_5 = Array.isArray(/*$currentProject*/ ctx[0]?.discipline);
    	let t10;
    	let div5;
    	let t12;
    	let show_if_4 = Array.isArray(/*$currentProject*/ ctx[0]?.temporalCoverage);
    	let t13;
    	let div6;
    	let t15;
    	let show_if_3 = Array.isArray(/*$currentProject*/ ctx[0]?.spatialCoverage);
    	let t16;
    	let div7;
    	let t18;
    	let div8;
    	let t19_value = /*$currentProject*/ ctx[0]?.startDate + "";
    	let t19;
    	let t20;
    	let t21;
    	let div9;
    	let t23;
    	let show_if_2 = Array.isArray(/*$currentProject*/ ctx[0]?.funder);
    	let t24;
    	let show_if_1 = /*$currentProject*/ ctx[0]?.grant && Array.isArray(/*$currentProject*/ ctx[0]?.grant);
    	let t25;
    	let t26;
    	let div10;
    	let t28;
    	let show_if = Array.isArray(/*$currentProject*/ ctx[0]?.url);
    	let t29;
    	let if_block8_anchor;
    	let if_block0 = show_if_5 && create_if_block_18(ctx);
    	let if_block1 = show_if_4 && create_if_block_16(ctx);
    	let if_block2 = show_if_3 && create_if_block_14(ctx);
    	let if_block3 = /*$currentProject*/ ctx[0]?.endDate && create_if_block_13(ctx);
    	let if_block4 = show_if_2 && create_if_block_10(ctx);
    	let if_block5 = show_if_1 && create_if_block_7(ctx);
    	let if_block6 = /*$currentProject*/ ctx[0]?.contactPoint && create_if_block_2$1(ctx);
    	let if_block7 = show_if && create_if_block_1$2(ctx);
    	let if_block8 = /*$currentProject*/ ctx[0] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = "DSP Internal Shortcode";
    			t1 = space();
    			div1 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			div2 = element("div");
    			div2.textContent = "Data Management Plan";
    			t5 = space();
    			div3 = element("div");
    			t6 = text(t6_value);
    			t7 = space();
    			div4 = element("div");
    			div4.textContent = "Discipline";
    			t9 = space();
    			if (if_block0) if_block0.c();
    			t10 = space();
    			div5 = element("div");
    			div5.textContent = "Temporal Coverage";
    			t12 = space();
    			if (if_block1) if_block1.c();
    			t13 = space();
    			div6 = element("div");
    			div6.textContent = "Spatial Coverage";
    			t15 = space();
    			if (if_block2) if_block2.c();
    			t16 = space();
    			div7 = element("div");
    			div7.textContent = "Start date";
    			t18 = space();
    			div8 = element("div");
    			t19 = text(t19_value);
    			t20 = space();
    			if (if_block3) if_block3.c();
    			t21 = space();
    			div9 = element("div");
    			div9.textContent = "Funder";
    			t23 = space();
    			if (if_block4) if_block4.c();
    			t24 = space();
    			if (if_block5) if_block5.c();
    			t25 = space();
    			if (if_block6) if_block6.c();
    			t26 = space();
    			div10 = element("div");
    			div10.textContent = "Project Website";
    			t28 = space();
    			if (if_block7) if_block7.c();
    			t29 = space();
    			if (if_block8) if_block8.c();
    			if_block8_anchor = empty();
    			attr_dev(div0, "class", "label svelte-oyq19y");
    			add_location(div0, file$8, 24, 0, 712);
    			attr_dev(div1, "class", "data svelte-oyq19y");
    			add_location(div1, file$8, 25, 0, 758);
    			attr_dev(div2, "class", "label svelte-oyq19y");
    			add_location(div2, file$8, 27, 0, 810);
    			attr_dev(div3, "class", "data svelte-oyq19y");
    			add_location(div3, file$8, 28, 0, 854);
    			attr_dev(div4, "class", "label svelte-oyq19y");
    			add_location(div4, file$8, 30, 0, 945);
    			attr_dev(div5, "class", "label svelte-oyq19y");
    			add_location(div5, file$8, 47, 0, 1578);
    			attr_dev(div6, "class", "label svelte-oyq19y");
    			add_location(div6, file$8, 58, 0, 1915);
    			attr_dev(div7, "class", "label svelte-oyq19y");
    			add_location(div7, file$8, 70, 0, 2526);
    			attr_dev(div8, "class", "data svelte-oyq19y");
    			add_location(div8, file$8, 71, 0, 2560);
    			attr_dev(div9, "class", "label svelte-oyq19y");
    			add_location(div9, file$8, 78, 0, 2731);
    			attr_dev(div10, "class", "label svelte-oyq19y");
    			add_location(div10, file$8, 121, 0, 4975);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div2, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, t6);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, div4, anchor);
    			insert_dev(target, t9, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, div5, anchor);
    			insert_dev(target, t12, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, div6, anchor);
    			insert_dev(target, t15, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, t16, anchor);
    			insert_dev(target, div7, anchor);
    			insert_dev(target, t18, anchor);
    			insert_dev(target, div8, anchor);
    			append_dev(div8, t19);
    			insert_dev(target, t20, anchor);
    			if (if_block3) if_block3.m(target, anchor);
    			insert_dev(target, t21, anchor);
    			insert_dev(target, div9, anchor);
    			insert_dev(target, t23, anchor);
    			if (if_block4) if_block4.m(target, anchor);
    			insert_dev(target, t24, anchor);
    			if (if_block5) if_block5.m(target, anchor);
    			insert_dev(target, t25, anchor);
    			if (if_block6) if_block6.m(target, anchor);
    			insert_dev(target, t26, anchor);
    			insert_dev(target, div10, anchor);
    			insert_dev(target, t28, anchor);
    			if (if_block7) if_block7.m(target, anchor);
    			insert_dev(target, t29, anchor);
    			if (if_block8) if_block8.m(target, anchor);
    			insert_dev(target, if_block8_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$currentProject*/ 1 && t2_value !== (t2_value = /*$currentProject*/ ctx[0]?.shortcode + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*$currentProject*/ 1 && t6_value !== (t6_value = ((/*$currentProject*/ ctx[0]?.dataManagementPlan)
    			? "available"
    			: "unavailable") + "")) set_data_dev(t6, t6_value);

    			if (dirty & /*$currentProject*/ 1) show_if_5 = Array.isArray(/*$currentProject*/ ctx[0]?.discipline);

    			if (show_if_5) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_18(ctx);
    					if_block0.c();
    					if_block0.m(t10.parentNode, t10);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*$currentProject*/ 1) show_if_4 = Array.isArray(/*$currentProject*/ ctx[0]?.temporalCoverage);

    			if (show_if_4) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_16(ctx);
    					if_block1.c();
    					if_block1.m(t13.parentNode, t13);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*$currentProject*/ 1) show_if_3 = Array.isArray(/*$currentProject*/ ctx[0]?.spatialCoverage);

    			if (show_if_3) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_14(ctx);
    					if_block2.c();
    					if_block2.m(t16.parentNode, t16);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (dirty & /*$currentProject*/ 1 && t19_value !== (t19_value = /*$currentProject*/ ctx[0]?.startDate + "")) set_data_dev(t19, t19_value);

    			if (/*$currentProject*/ ctx[0]?.endDate) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_13(ctx);
    					if_block3.c();
    					if_block3.m(t21.parentNode, t21);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (dirty & /*$currentProject*/ 1) show_if_2 = Array.isArray(/*$currentProject*/ ctx[0]?.funder);

    			if (show_if_2) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_10(ctx);
    					if_block4.c();
    					if_block4.m(t24.parentNode, t24);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (dirty & /*$currentProject*/ 1) show_if_1 = /*$currentProject*/ ctx[0]?.grant && Array.isArray(/*$currentProject*/ ctx[0]?.grant);

    			if (show_if_1) {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block_7(ctx);
    					if_block5.c();
    					if_block5.m(t25.parentNode, t25);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (/*$currentProject*/ ctx[0]?.contactPoint) {
    				if (if_block6) {
    					if_block6.p(ctx, dirty);
    				} else {
    					if_block6 = create_if_block_2$1(ctx);
    					if_block6.c();
    					if_block6.m(t26.parentNode, t26);
    				}
    			} else if (if_block6) {
    				if_block6.d(1);
    				if_block6 = null;
    			}

    			if (dirty & /*$currentProject*/ 1) show_if = Array.isArray(/*$currentProject*/ ctx[0]?.url);

    			if (show_if) {
    				if (if_block7) {
    					if_block7.p(ctx, dirty);
    				} else {
    					if_block7 = create_if_block_1$2(ctx);
    					if_block7.c();
    					if_block7.m(t29.parentNode, t29);
    				}
    			} else if (if_block7) {
    				if_block7.d(1);
    				if_block7 = null;
    			}

    			if (/*$currentProject*/ ctx[0]) {
    				if (if_block8) {
    					if_block8.p(ctx, dirty);
    				} else {
    					if_block8 = create_if_block$4(ctx);
    					if_block8.c();
    					if_block8.m(if_block8_anchor.parentNode, if_block8_anchor);
    				}
    			} else if (if_block8) {
    				if_block8.d(1);
    				if_block8 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div3);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(div4);
    			if (detaching) detach_dev(t9);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(div5);
    			if (detaching) detach_dev(t12);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(div6);
    			if (detaching) detach_dev(t15);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(t16);
    			if (detaching) detach_dev(div7);
    			if (detaching) detach_dev(t18);
    			if (detaching) detach_dev(div8);
    			if (detaching) detach_dev(t20);
    			if (if_block3) if_block3.d(detaching);
    			if (detaching) detach_dev(t21);
    			if (detaching) detach_dev(div9);
    			if (detaching) detach_dev(t23);
    			if (if_block4) if_block4.d(detaching);
    			if (detaching) detach_dev(t24);
    			if (if_block5) if_block5.d(detaching);
    			if (detaching) detach_dev(t25);
    			if (if_block6) if_block6.d(detaching);
    			if (detaching) detach_dev(t26);
    			if (detaching) detach_dev(div10);
    			if (detaching) detach_dev(t28);
    			if (if_block7) if_block7.d(detaching);
    			if (detaching) detach_dev(t29);
    			if (if_block8) if_block8.d(detaching);
    			if (detaching) detach_dev(if_block8_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let $currentProjectMetadata;
    	let $currentProject;
    	validate_store(currentProjectMetadata, "currentProjectMetadata");
    	component_subscribe($$self, currentProjectMetadata, $$value => $$invalidate(5, $currentProjectMetadata = $$value));
    	validate_store(currentProject, "currentProject");
    	component_subscribe($$self, currentProject, $$value => $$invalidate(0, $currentProject = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ProjectWidget", slots, []);
    	let grant;

    	const findObjectById = id => {
    		grant = $currentProjectMetadata?.metadata.find(obj => obj.id === id);
    		return $currentProjectMetadata?.metadata.find(obj => obj.id === id);
    	};

    	const handleSpatialCoverageName = s => {

    		// return s.split("/")[4].split('.')[0].split("-").join(' ');
    		return s.substr(s.lastIndexOf("/") + 1).split(".")[0].split("-").join(" ");
    	}; // return s.match(regex)[0].split('.')[0].split("-").join(' ');

    	const truncateString = s => {
    		if (s.length > 35) {
    			return `${s.slice(0, 35)}...`;
    		} else return s;
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ProjectWidget> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		currentProject,
    		currentProjectMetadata,
    		grant,
    		findObjectById,
    		handleSpatialCoverageName,
    		truncateString,
    		$currentProjectMetadata,
    		$currentProject
    	});

    	$$self.$inject_state = $$props => {
    		if ("grant" in $$props) grant = $$props.grant;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$currentProject, findObjectById, handleSpatialCoverageName, truncateString];
    }

    class ProjectWidget extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProjectWidget",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* services/metadata/frontend/project-page/DownloadWidget.svelte generated by Svelte v3.32.1 */

    const file$9 = "services/metadata/frontend/project-page/DownloadWidget.svelte";

    function create_fragment$b(ctx) {
    	let h3;
    	let t1;
    	let button0;
    	let t3;
    	let button1;
    	let t5;
    	let button2;
    	let t7;
    	let button3;
    	let t9;
    	let button4;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			h3.textContent = "Download metadata";
    			t1 = space();
    			button0 = element("button");
    			button0.textContent = "JSON";
    			t3 = space();
    			button1 = element("button");
    			button1.textContent = "JSON-LD";
    			t5 = space();
    			button2 = element("button");
    			button2.textContent = "XML";
    			t7 = space();
    			button3 = element("button");
    			button3.textContent = "RDF";
    			t9 = space();
    			button4 = element("button");
    			button4.textContent = "CSV";
    			attr_dev(h3, "class", "widget-heading");
    			add_location(h3, file$9, 0, 0, 0);
    			attr_dev(button0, "class", "svelte-1a91ex1");
    			add_location(button0, file$9, 1, 0, 48);
    			attr_dev(button1, "class", "svelte-1a91ex1");
    			add_location(button1, file$9, 2, 0, 70);
    			attr_dev(button2, "class", "svelte-1a91ex1");
    			add_location(button2, file$9, 3, 0, 95);
    			attr_dev(button3, "class", "svelte-1a91ex1");
    			add_location(button3, file$9, 4, 0, 116);
    			attr_dev(button4, "class", "svelte-1a91ex1");
    			add_location(button4, file$9, 5, 0, 137);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, button1, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, button2, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, button3, anchor);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, button4, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(button1);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(button2);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(button3);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(button4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("DownloadWidget", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<DownloadWidget> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class DownloadWidget extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DownloadWidget",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* services/metadata/frontend/project-page/DefaultTabComponent.svelte generated by Svelte v3.32.1 */

    const { console: console_1$2 } = globals;
    const file$a = "services/metadata/frontend/project-page/DefaultTabComponent.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    function get_each_context_3$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    function get_each_context_4$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[20] = list[i];
    	return child_ctx;
    }

    function get_each_context_5$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	return child_ctx;
    }

    // (66:2) {#if dataset}
    function create_if_block$5(ctx) {
    	let t0;
    	let div4;
    	let div0;
    	let span0;
    	let t2;
    	let span1;
    	let t3_value = /*dataset*/ ctx[0]?.content.conditionsOfAccess + "";
    	let t3;
    	let t4;
    	let div1;
    	let span2;
    	let t6;
    	let span3;
    	let t7_value = /*dataset*/ ctx[0]?.content.status + "";
    	let t7;
    	let t8;
    	let t9;
    	let t10;
    	let div2;
    	let span4;
    	let t12;
    	let show_if_2 = Array.isArray(/*dataset*/ ctx[0]?.content.license);
    	let t13;
    	let div3;
    	let span5;
    	let t15;
    	let span6;
    	let t16_value = /*dataset*/ ctx[0]?.content.typeOfData.join(", ") + "";
    	let t16;
    	let t17;
    	let t18;
    	let div6;
    	let div5;
    	let span7;
    	let t20;
    	let span8;
    	let t21_value = /*dataset*/ ctx[0]?.content.language.join(", ") + "";
    	let t21;
    	let t22;
    	let t23;
    	let div7;
    	let span9;
    	let t24;
    	let button;
    	let svg;
    	let path;
    	let t25;
    	let span10;
    	let t26_value = /*dataset*/ ctx[0]?.content.howToCite + "";
    	let t26;
    	let t27;
    	let div8;
    	let span11;
    	let t29;
    	let show_if_1 = Array.isArray(/*dataset*/ ctx[0]?.content.abstract);
    	let t30;
    	let t31;
    	let span12;
    	let t33;
    	let div9;
    	let show_if = Array.isArray(/*mergedAttributions*/ ctx[7]);
    	let mounted;
    	let dispose;
    	let if_block0 = /*dataset*/ ctx[0]?.content.alternativeTitle && create_if_block_18$1(ctx);
    	let if_block1 = /*dataset*/ ctx[0].content.dateCreated && create_if_block_17$1(ctx);
    	let if_block2 = /*dataset*/ ctx[0].content.dateModified && create_if_block_16$1(ctx);
    	let if_block3 = show_if_2 && create_if_block_15$1(ctx);
    	let if_block4 = /*dataset*/ ctx[0]?.content.documentation && create_if_block_11$1(ctx);
    	let if_block5 = /*dataset*/ ctx[0]?.content.sameAs && create_if_block_9$1(ctx);
    	let if_block6 = show_if_1 && create_if_block_7$1(ctx);
    	let if_block7 = /*abstractLinesNumber*/ ctx[2] > 6 && create_if_block_6$1(ctx);
    	let if_block8 = show_if && create_if_block_1$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div4 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			span0.textContent = "Access";
    			t2 = space();
    			span1 = element("span");
    			t3 = text(t3_value);
    			t4 = space();
    			div1 = element("div");
    			span2 = element("span");
    			span2.textContent = "Status";
    			t6 = space();
    			span3 = element("span");
    			t7 = text(t7_value);
    			t8 = space();
    			if (if_block1) if_block1.c();
    			t9 = space();
    			if (if_block2) if_block2.c();
    			t10 = space();
    			div2 = element("div");
    			span4 = element("span");
    			span4.textContent = "License";
    			t12 = space();
    			if (if_block3) if_block3.c();
    			t13 = space();
    			div3 = element("div");
    			span5 = element("span");
    			span5.textContent = "Type of Data";
    			t15 = space();
    			span6 = element("span");
    			t16 = text(t16_value);
    			t17 = space();
    			if (if_block4) if_block4.c();
    			t18 = space();
    			div6 = element("div");
    			div5 = element("div");
    			span7 = element("span");
    			span7.textContent = "Languages";
    			t20 = space();
    			span8 = element("span");
    			t21 = text(t21_value);
    			t22 = space();
    			if (if_block5) if_block5.c();
    			t23 = space();
    			div7 = element("div");
    			span9 = element("span");
    			t24 = text("How To Cite\n      ");
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t25 = space();
    			span10 = element("span");
    			t26 = text(t26_value);
    			t27 = space();
    			div8 = element("div");
    			span11 = element("span");
    			span11.textContent = "Abstract";
    			t29 = space();
    			if (if_block6) if_block6.c();
    			t30 = space();
    			if (if_block7) if_block7.c();
    			t31 = space();
    			span12 = element("span");
    			span12.textContent = "Attributions";
    			t33 = space();
    			div9 = element("div");
    			if (if_block8) if_block8.c();
    			attr_dev(span0, "class", "label");
    			add_location(span0, file$a, 74, 6, 2383);
    			attr_dev(span1, "class", "data");
    			add_location(span1, file$a, 75, 6, 2421);
    			add_location(div0, file$a, 73, 4, 2371);
    			attr_dev(span2, "class", "label");
    			add_location(span2, file$a, 78, 6, 2510);
    			attr_dev(span3, "class", "data");
    			add_location(span3, file$a, 79, 6, 2548);
    			add_location(div1, file$a, 77, 4, 2498);
    			attr_dev(span4, "class", "label");
    			add_location(span4, file$a, 94, 6, 2992);
    			add_location(div2, file$a, 93, 4, 2980);
    			attr_dev(span5, "class", "label");
    			add_location(span5, file$a, 102, 6, 3313);
    			attr_dev(span6, "class", "data");
    			add_location(span6, file$a, 103, 6, 3357);
    			add_location(div3, file$a, 101, 4, 3301);
    			attr_dev(div4, "class", "grid-wrapper svelte-tzyzs0");
    			add_location(div4, file$a, 72, 2, 2340);
    			attr_dev(span7, "class", "label");
    			add_location(span7, file$a, 125, 6, 4187);
    			attr_dev(span8, "class", "data");
    			add_location(span8, file$a, 126, 6, 4228);
    			add_location(div5, file$a, 124, 4, 4175);
    			attr_dev(div6, "class", "grid-wrapper svelte-tzyzs0");
    			set_style(div6, "grid-template-columns", "repeat(1, 1fr)");
    			add_location(div6, file$a, 123, 2, 4098);
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "d", "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z");
    			add_location(path, file$a, 149, 116, 5053);
    			attr_dev(svg, "class", "icon svelte-tzyzs0");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$a, 149, 9, 4946);
    			attr_dev(button, "title", "copy citation to the clipboard");
    			attr_dev(button, "class", "svelte-tzyzs0");
    			add_location(button, file$a, 148, 6, 4862);
    			attr_dev(span9, "class", "label");
    			set_style(span9, "display", "inline");
    			add_location(span9, file$a, 146, 4, 4796);
    			attr_dev(span10, "id", "how-to-cite");
    			attr_dev(span10, "class", "data");
    			add_location(span10, file$a, 152, 4, 5291);
    			attr_dev(div7, "class", "property-row");
    			add_location(div7, file$a, 145, 2, 4765);
    			attr_dev(span11, "class", "label");
    			add_location(span11, file$a, 156, 4, 5381);
    			add_location(div8, file$a, 155, 2, 5371);
    			attr_dev(span12, "class", "label");
    			add_location(span12, file$a, 174, 2, 5977);
    			attr_dev(div9, "class", "grid-wrapper svelte-tzyzs0");
    			add_location(div9, file$a, 175, 2, 6017);
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div0, span0);
    			append_dev(div0, t2);
    			append_dev(div0, span1);
    			append_dev(span1, t3);
    			append_dev(div4, t4);
    			append_dev(div4, div1);
    			append_dev(div1, span2);
    			append_dev(div1, t6);
    			append_dev(div1, span3);
    			append_dev(span3, t7);
    			append_dev(div4, t8);
    			if (if_block1) if_block1.m(div4, null);
    			append_dev(div4, t9);
    			if (if_block2) if_block2.m(div4, null);
    			append_dev(div4, t10);
    			append_dev(div4, div2);
    			append_dev(div2, span4);
    			append_dev(div2, t12);
    			if (if_block3) if_block3.m(div2, null);
    			append_dev(div4, t13);
    			append_dev(div4, div3);
    			append_dev(div3, span5);
    			append_dev(div3, t15);
    			append_dev(div3, span6);
    			append_dev(span6, t16);
    			append_dev(div4, t17);
    			if (if_block4) if_block4.m(div4, null);
    			insert_dev(target, t18, anchor);
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div5);
    			append_dev(div5, span7);
    			append_dev(div5, t20);
    			append_dev(div5, span8);
    			append_dev(span8, t21);
    			insert_dev(target, t22, anchor);
    			if (if_block5) if_block5.m(target, anchor);
    			insert_dev(target, t23, anchor);
    			insert_dev(target, div7, anchor);
    			append_dev(div7, span9);
    			append_dev(span9, t24);
    			append_dev(span9, button);
    			append_dev(button, svg);
    			append_dev(svg, path);
    			append_dev(div7, t25);
    			append_dev(div7, span10);
    			append_dev(span10, t26);
    			insert_dev(target, t27, anchor);
    			insert_dev(target, div8, anchor);
    			append_dev(div8, span11);
    			append_dev(div8, t29);
    			if (if_block6) if_block6.m(div8, null);
    			insert_dev(target, t30, anchor);
    			if (if_block7) if_block7.m(target, anchor);
    			insert_dev(target, t31, anchor);
    			insert_dev(target, span12, anchor);
    			insert_dev(target, t33, anchor);
    			insert_dev(target, div9, anchor);
    			if (if_block8) if_block8.m(div9, null);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*copyToClipboard*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*dataset*/ ctx[0]?.content.alternativeTitle) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_18$1(ctx);
    					if_block0.c();
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*dataset*/ 1 && t3_value !== (t3_value = /*dataset*/ ctx[0]?.content.conditionsOfAccess + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*dataset*/ 1 && t7_value !== (t7_value = /*dataset*/ ctx[0]?.content.status + "")) set_data_dev(t7, t7_value);

    			if (/*dataset*/ ctx[0].content.dateCreated) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_17$1(ctx);
    					if_block1.c();
    					if_block1.m(div4, t9);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*dataset*/ ctx[0].content.dateModified) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_16$1(ctx);
    					if_block2.c();
    					if_block2.m(div4, t10);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (dirty & /*dataset*/ 1) show_if_2 = Array.isArray(/*dataset*/ ctx[0]?.content.license);

    			if (show_if_2) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_15$1(ctx);
    					if_block3.c();
    					if_block3.m(div2, null);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (dirty & /*dataset*/ 1 && t16_value !== (t16_value = /*dataset*/ ctx[0]?.content.typeOfData.join(", ") + "")) set_data_dev(t16, t16_value);

    			if (/*dataset*/ ctx[0]?.content.documentation) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_11$1(ctx);
    					if_block4.c();
    					if_block4.m(div4, null);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (dirty & /*dataset*/ 1 && t21_value !== (t21_value = /*dataset*/ ctx[0]?.content.language.join(", ") + "")) set_data_dev(t21, t21_value);

    			if (/*dataset*/ ctx[0]?.content.sameAs) {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block_9$1(ctx);
    					if_block5.c();
    					if_block5.m(t23.parentNode, t23);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (dirty & /*dataset*/ 1 && t26_value !== (t26_value = /*dataset*/ ctx[0]?.content.howToCite + "")) set_data_dev(t26, t26_value);
    			if (dirty & /*dataset*/ 1) show_if_1 = Array.isArray(/*dataset*/ ctx[0]?.content.abstract);

    			if (show_if_1) {
    				if (if_block6) {
    					if_block6.p(ctx, dirty);
    				} else {
    					if_block6 = create_if_block_7$1(ctx);
    					if_block6.c();
    					if_block6.m(div8, null);
    				}
    			} else if (if_block6) {
    				if_block6.d(1);
    				if_block6 = null;
    			}

    			if (/*abstractLinesNumber*/ ctx[2] > 6) {
    				if (if_block7) {
    					if_block7.p(ctx, dirty);
    				} else {
    					if_block7 = create_if_block_6$1(ctx);
    					if_block7.c();
    					if_block7.m(t31.parentNode, t31);
    				}
    			} else if (if_block7) {
    				if_block7.d(1);
    				if_block7 = null;
    			}

    			if (show_if) if_block8.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div4);
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (detaching) detach_dev(t18);
    			if (detaching) detach_dev(div6);
    			if (detaching) detach_dev(t22);
    			if (if_block5) if_block5.d(detaching);
    			if (detaching) detach_dev(t23);
    			if (detaching) detach_dev(div7);
    			if (detaching) detach_dev(t27);
    			if (detaching) detach_dev(div8);
    			if (if_block6) if_block6.d();
    			if (detaching) detach_dev(t30);
    			if (if_block7) if_block7.d(detaching);
    			if (detaching) detach_dev(t31);
    			if (detaching) detach_dev(span12);
    			if (detaching) detach_dev(t33);
    			if (detaching) detach_dev(div9);
    			if (if_block8) if_block8.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(66:2) {#if dataset}",
    		ctx
    	});

    	return block;
    }

    // (67:4) {#if dataset?.content.alternativeTitle}
    function create_if_block_18$1(ctx) {
    	let div;
    	let span0;
    	let t1;
    	let span1;
    	let t2_value = /*dataset*/ ctx[0]?.content.alternativeTitle + "";
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span0 = element("span");
    			span0.textContent = "Alternative Title";
    			t1 = space();
    			span1 = element("span");
    			t2 = text(t2_value);
    			attr_dev(span0, "class", "label");
    			add_location(span0, file$a, 68, 8, 2204);
    			attr_dev(span1, "class", "data");
    			add_location(span1, file$a, 69, 8, 2255);
    			add_location(div, file$a, 67, 6, 2190);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span0);
    			append_dev(div, t1);
    			append_dev(div, span1);
    			append_dev(span1, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*dataset*/ 1 && t2_value !== (t2_value = /*dataset*/ ctx[0]?.content.alternativeTitle + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_18$1.name,
    		type: "if",
    		source: "(67:4) {#if dataset?.content.alternativeTitle}",
    		ctx
    	});

    	return block;
    }

    // (82:4) {#if dataset.content.dateCreated}
    function create_if_block_17$1(ctx) {
    	let div;
    	let span0;
    	let t1;
    	let span1;
    	let t2_value = /*dataset*/ ctx[0]?.content.dateCreated + "";
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span0 = element("span");
    			span0.textContent = "Date Created";
    			t1 = space();
    			span1 = element("span");
    			t2 = text(t2_value);
    			attr_dev(span0, "class", "label");
    			add_location(span0, file$a, 83, 8, 2667);
    			attr_dev(span1, "class", "data");
    			add_location(span1, file$a, 84, 8, 2713);
    			add_location(div, file$a, 82, 6, 2653);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span0);
    			append_dev(div, t1);
    			append_dev(div, span1);
    			append_dev(span1, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*dataset*/ 1 && t2_value !== (t2_value = /*dataset*/ ctx[0]?.content.dateCreated + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_17$1.name,
    		type: "if",
    		source: "(82:4) {#if dataset.content.dateCreated}",
    		ctx
    	});

    	return block;
    }

    // (88:4) {#if dataset.content.dateModified}
    function create_if_block_16$1(ctx) {
    	let div;
    	let span0;
    	let t1;
    	let span1;
    	let t2_value = /*dataset*/ ctx[0]?.content.dateModified + "";
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span0 = element("span");
    			span0.textContent = "Date Modified";
    			t1 = space();
    			span1 = element("span");
    			t2 = text(t2_value);
    			attr_dev(span0, "class", "label");
    			add_location(span0, file$a, 89, 8, 2850);
    			attr_dev(span1, "class", "data");
    			add_location(span1, file$a, 90, 8, 2897);
    			add_location(div, file$a, 88, 6, 2836);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span0);
    			append_dev(div, t1);
    			append_dev(div, span1);
    			append_dev(span1, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*dataset*/ 1 && t2_value !== (t2_value = /*dataset*/ ctx[0]?.content.dateModified + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_16$1.name,
    		type: "if",
    		source: "(88:4) {#if dataset.content.dateModified}",
    		ctx
    	});

    	return block;
    }

    // (96:6) {#if Array.isArray(dataset?.content.license)}
    function create_if_block_15$1(ctx) {
    	let each_1_anchor;
    	let each_value_5 = /*dataset*/ ctx[0]?.content.license;
    	validate_each_argument(each_value_5);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		each_blocks[i] = create_each_block_5$1(get_each_context_5$1(ctx, each_value_5, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*dataset*/ 1) {
    				each_value_5 = /*dataset*/ ctx[0]?.content.license;
    				validate_each_argument(each_value_5);
    				let i;

    				for (i = 0; i < each_value_5.length; i += 1) {
    					const child_ctx = get_each_context_5$1(ctx, each_value_5, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_5$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_5.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_15$1.name,
    		type: "if",
    		source: "(96:6) {#if Array.isArray(dataset?.content.license)}",
    		ctx
    	});

    	return block;
    }

    // (97:8) {#each dataset?.content.license as l}
    function create_each_block_5$1(ctx) {
    	let a;
    	let t0;
    	let t1_value = `${/*l*/ ctx[23].url.split("/")[4]} ${/*l*/ ctx[23].url.split("/")[5]}`.toUpperCase() + "";
    	let t1;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t0 = text("CC ");
    			t1 = text(t1_value);
    			attr_dev(a, "href", a_href_value = /*l*/ ctx[23].url);
    			attr_dev(a, "class", "data external-link svelte-tzyzs0");
    			attr_dev(a, "target", "_");
    			add_location(a, file$a, 97, 10, 3133);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t0);
    			append_dev(a, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*dataset*/ 1 && t1_value !== (t1_value = `${/*l*/ ctx[23].url.split("/")[4]} ${/*l*/ ctx[23].url.split("/")[5]}`.toUpperCase() + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*dataset*/ 1 && a_href_value !== (a_href_value = /*l*/ ctx[23].url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_5$1.name,
    		type: "each",
    		source: "(97:8) {#each dataset?.content.license as l}",
    		ctx
    	});

    	return block;
    }

    // (106:4) {#if dataset?.content.documentation}
    function create_if_block_11$1(ctx) {
    	let div;
    	let span;
    	let t1;
    	let show_if = Array.isArray(/*dataset*/ ctx[0]?.content.documentation);
    	let if_block = show_if && create_if_block_12$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "Additional documentation";
    			t1 = space();
    			if (if_block) if_block.c();
    			attr_dev(span, "class", "label");
    			add_location(span, file$a, 107, 8, 3543);
    			set_style(div, "grid-column-start", "1");
    			set_style(div, "grid-column-end", "3");
    			add_location(div, file$a, 106, 6, 3480);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(div, t1);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*dataset*/ 1) show_if = Array.isArray(/*dataset*/ ctx[0]?.content.documentation);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_12$1(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11$1.name,
    		type: "if",
    		source: "(106:4) {#if dataset?.content.documentation}",
    		ctx
    	});

    	return block;
    }

    // (109:8) {#if Array.isArray(dataset?.content.documentation)}
    function create_if_block_12$1(ctx) {
    	let each_1_anchor;
    	let each_value_4 = /*dataset*/ ctx[0]?.content.documentation;
    	validate_each_argument(each_value_4);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks[i] = create_each_block_4$1(get_each_context_4$1(ctx, each_value_4, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*dataset, truncateString*/ 65) {
    				each_value_4 = /*dataset*/ ctx[0]?.content.documentation;
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4$1(ctx, each_value_4, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_4$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_4.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12$1.name,
    		type: "if",
    		source: "(109:8) {#if Array.isArray(dataset?.content.documentation)}",
    		ctx
    	});

    	return block;
    }

    // (115:12) {:else}
    function create_else_block_4$1(ctx) {
    	let span;
    	let t_value = /*d*/ ctx[20] + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "data");
    			add_location(span, file$a, 115, 14, 3985);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*dataset*/ 1 && t_value !== (t_value = /*d*/ ctx[20] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_4$1.name,
    		type: "else",
    		source: "(115:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (113:38) 
    function create_if_block_14$1(ctx) {
    	let a;
    	let t_value = /*truncateString*/ ctx[6](/*d*/ ctx[20]) + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "class", "data external-link svelte-tzyzs0");
    			attr_dev(a, "href", a_href_value = /*d*/ ctx[20]);
    			attr_dev(a, "target", "_");
    			add_location(a, file$a, 113, 14, 3879);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*dataset*/ 1 && t_value !== (t_value = /*truncateString*/ ctx[6](/*d*/ ctx[20]) + "")) set_data_dev(t, t_value);

    			if (dirty & /*dataset*/ 1 && a_href_value !== (a_href_value = /*d*/ ctx[20])) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_14$1.name,
    		type: "if",
    		source: "(113:38) ",
    		ctx
    	});

    	return block;
    }

    // (111:12) {#if d.url}
    function create_if_block_13$1(ctx) {
    	let a;
    	let t_value = /*truncateString*/ ctx[6](/*d*/ ctx[20].name) + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "class", "data external-link svelte-tzyzs0");
    			attr_dev(a, "href", a_href_value = /*d*/ ctx[20].url);
    			attr_dev(a, "target", "_");
    			add_location(a, file$a, 111, 14, 3745);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*dataset*/ 1 && t_value !== (t_value = /*truncateString*/ ctx[6](/*d*/ ctx[20].name) + "")) set_data_dev(t, t_value);

    			if (dirty & /*dataset*/ 1 && a_href_value !== (a_href_value = /*d*/ ctx[20].url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13$1.name,
    		type: "if",
    		source: "(111:12) {#if d.url}",
    		ctx
    	});

    	return block;
    }

    // (110:10) {#each dataset?.content.documentation as d}
    function create_each_block_4$1(ctx) {
    	let show_if;
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*d*/ ctx[20].url) return create_if_block_13$1;
    		if (show_if == null || dirty & /*dataset*/ 1) show_if = !!/*d*/ ctx[20].match("http");
    		if (show_if) return create_if_block_14$1;
    		return create_else_block_4$1;
    	}

    	let current_block_type = select_block_type(ctx, -1);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4$1.name,
    		type: "each",
    		source: "(110:10) {#each dataset?.content.documentation as d}",
    		ctx
    	});

    	return block;
    }

    // (131:2) {#if dataset?.content.sameAs}
    function create_if_block_9$1(ctx) {
    	let div1;
    	let div0;
    	let span;
    	let t1;
    	let each_value_3 = /*dataset*/ ctx[0]?.content.sameAs;
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3$1(get_each_context_3$1(ctx, each_value_3, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			span = element("span");
    			span.textContent = "Dataset Website";
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(span, "class", "label");
    			add_location(span, file$a, 133, 8, 4441);
    			add_location(div0, file$a, 132, 6, 4427);
    			attr_dev(div1, "class", "grid-wrapper svelte-tzyzs0");
    			set_style(div1, "grid-template-columns", "repeat(1, 1fr)");
    			add_location(div1, file$a, 131, 4, 4348);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, span);
    			append_dev(div0, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*dataset, truncateString*/ 65) {
    				each_value_3 = /*dataset*/ ctx[0]?.content.sameAs;
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3$1(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9$1.name,
    		type: "if",
    		source: "(131:2) {#if dataset?.content.sameAs}",
    		ctx
    	});

    	return block;
    }

    // (138:10) {:else}
    function create_else_block_3$1(ctx) {
    	let div;
    	let t_value = /*a*/ ctx[10] + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			add_location(div, file$a, 138, 12, 4683);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*dataset*/ 1 && t_value !== (t_value = /*a*/ ctx[10] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_3$1.name,
    		type: "else",
    		source: "(138:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (136:10) {#if a.url}
    function create_if_block_10$1(ctx) {
    	let div;
    	let a;
    	let t_value = /*truncateString*/ ctx[6](/*a*/ ctx[10].name) + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "class", "data external-link svelte-tzyzs0");
    			attr_dev(a, "href", a_href_value = /*a*/ ctx[10].url);
    			attr_dev(a, "target", "_");
    			add_location(a, file$a, 136, 17, 4566);
    			add_location(div, file$a, 136, 12, 4561);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*dataset*/ 1 && t_value !== (t_value = /*truncateString*/ ctx[6](/*a*/ ctx[10].name) + "")) set_data_dev(t, t_value);

    			if (dirty & /*dataset*/ 1 && a_href_value !== (a_href_value = /*a*/ ctx[10].url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10$1.name,
    		type: "if",
    		source: "(136:10) {#if a.url}",
    		ctx
    	});

    	return block;
    }

    // (135:8) {#each dataset?.content.sameAs as a}
    function create_each_block_3$1(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*a*/ ctx[10].url) return create_if_block_10$1;
    		return create_else_block_3$1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3$1.name,
    		type: "each",
    		source: "(135:8) {#each dataset?.content.sameAs as a}",
    		ctx
    	});

    	return block;
    }

    // (158:4) {#if Array.isArray(dataset?.content.abstract)}
    function create_if_block_7$1(ctx) {
    	let div;
    	let div_class_value;
    	let each_value_2 = /*dataset*/ ctx[0]?.content.abstract;
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "id", "abstract");
    			attr_dev(div, "class", div_class_value = "data " + (/*isAbstractExpanded*/ ctx[1] ? "" : "abstract-short") + " svelte-tzyzs0");
    			add_location(div, file$a, 158, 6, 5472);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*dataset, truncateString*/ 65) {
    				each_value_2 = /*dataset*/ ctx[0]?.content.abstract;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}

    			if (dirty & /*isAbstractExpanded*/ 2 && div_class_value !== (div_class_value = "data " + (/*isAbstractExpanded*/ ctx[1] ? "" : "abstract-short") + " svelte-tzyzs0")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$1.name,
    		type: "if",
    		source: "(158:4) {#if Array.isArray(dataset?.content.abstract)}",
    		ctx
    	});

    	return block;
    }

    // (163:10) {:else}
    function create_else_block_2$1(ctx) {
    	let div;
    	let t_value = /*a*/ ctx[10] + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			add_location(div, file$a, 163, 12, 5751);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*dataset*/ 1 && t_value !== (t_value = /*a*/ ctx[10] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2$1.name,
    		type: "else",
    		source: "(163:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (161:10) {#if a.url}
    function create_if_block_8$1(ctx) {
    	let div;
    	let a;
    	let t_value = /*truncateString*/ ctx[6](/*a*/ ctx[10].name) + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "class", "data external-link svelte-tzyzs0");
    			attr_dev(a, "href", a_href_value = /*a*/ ctx[10].url);
    			attr_dev(a, "target", "_");
    			add_location(a, file$a, 161, 17, 5634);
    			add_location(div, file$a, 161, 12, 5629);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*dataset*/ 1 && t_value !== (t_value = /*truncateString*/ ctx[6](/*a*/ ctx[10].name) + "")) set_data_dev(t, t_value);

    			if (dirty & /*dataset*/ 1 && a_href_value !== (a_href_value = /*a*/ ctx[10].url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8$1.name,
    		type: "if",
    		source: "(161:10) {#if a.url}",
    		ctx
    	});

    	return block;
    }

    // (160:8) {#each dataset?.content.abstract as a}
    function create_each_block_2$1(ctx) {
    	let if_block_anchor;

    	function select_block_type_2(ctx, dirty) {
    		if (/*a*/ ctx[10].url) return create_if_block_8$1;
    		return create_else_block_2$1;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(160:8) {#each dataset?.content.abstract as a}",
    		ctx
    	});

    	return block;
    }

    // (171:2) {#if abstractLinesNumber > 6}
    function create_if_block_6$1(ctx) {
    	let div;
    	let t0;
    	let t1_value = (/*isAbstractExpanded*/ ctx[1] ? "less" : "more") + "";
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("show ");
    			t1 = text(t1_value);
    			attr_dev(div, "class", "expand-button");
    			add_location(div, file$a, 171, 4, 5867);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*toggleExpand*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*isAbstractExpanded*/ 2 && t1_value !== (t1_value = (/*isAbstractExpanded*/ ctx[1] ? "less" : "more") + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(171:2) {#if abstractLinesNumber > 6}",
    		ctx
    	});

    	return block;
    }

    // (177:4) {#if Array.isArray(mergedAttributions)}
    function create_if_block_1$3(ctx) {
    	let each_1_anchor;
    	let each_value = /*mergedAttributions*/ ctx[7];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*findObjectById, mergedAttributions, Array*/ 144) {
    				each_value = /*mergedAttributions*/ ctx[7];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(177:4) {#if Array.isArray(mergedAttributions)}",
    		ctx
    	});

    	return block;
    }

    // (193:10) {:else}
    function create_else_block_1$1(ctx) {
    	let div;
    	let t_value = /*findObjectById*/ ctx[4](/*a*/ ctx[10].agent[0].id)?.name + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			add_location(div, file$a, 193, 12, 7129);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(193:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (181:10) {#if findObjectById(a.agent[0].id).type === "http://ns.dasch.swiss/repository#Person"}
    function create_if_block_3$1(ctx) {
    	let t0;
    	let show_if = Array.isArray(/*findObjectById*/ ctx[4](/*a*/ ctx[10].agent[0].id)?.memberOf);
    	let t1;
    	let div;
    	let t2_value = /*findObjectById*/ ctx[4](/*a*/ ctx[10].agent[0].id)?.jobTitle[0] + "";
    	let t2;

    	function select_block_type_4(ctx, dirty) {
    		if (/*findObjectById*/ ctx[4](/*a*/ ctx[10].agent[0].id)?.sameAs) return create_if_block_5$1;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type_4(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = show_if && create_if_block_4$1(ctx);

    	const block = {
    		c: function create() {
    			if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			div = element("div");
    			t2 = text(t2_value);
    			add_location(div, file$a, 191, 12, 7043);
    		},
    		m: function mount(target, anchor) {
    			if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, t2);
    		},
    		p: function update(ctx, dirty) {
    			if_block0.p(ctx, dirty);
    			if (show_if) if_block1.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(181:10) {#if findObjectById(a.agent[0].id).type === \\\"http://ns.dasch.swiss/repository#Person\\\"}",
    		ctx
    	});

    	return block;
    }

    // (184:12) {:else}
    function create_else_block$3(ctx) {
    	let div;
    	let t0_value = /*findObjectById*/ ctx[4](/*a*/ ctx[10].agent[0].id)?.givenName.split(";").join(" ") + "";
    	let t0;
    	let t1;
    	let t2_value = /*findObjectById*/ ctx[4](/*a*/ ctx[10].agent[0].id)?.familyName.split(";").join(" ") + "";
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			t2 = text(t2_value);
    			add_location(div, file$a, 184, 14, 6638);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(184:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (182:12) {#if findObjectById(a.agent[0].id)?.sameAs}
    function create_if_block_5$1(ctx) {
    	let a;
    	let t0_value = /*findObjectById*/ ctx[4](/*a*/ ctx[10].agent[0].id)?.givenName.split(";").join(" ") + "";
    	let t0;
    	let t1;
    	let t2_value = /*findObjectById*/ ctx[4](/*a*/ ctx[10].agent[0].id)?.familyName.split(";").join(" ") + "";
    	let t2;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			t2 = text(t2_value);
    			attr_dev(a, "href", /*findObjectById*/ ctx[4](/*a*/ ctx[10].agent[0].id)?.sameAs[0].url);
    			attr_dev(a, "target", "_");
    			attr_dev(a, "class", "external-link svelte-tzyzs0");
    			add_location(a, file$a, 182, 14, 6385);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t0);
    			append_dev(a, t1);
    			append_dev(a, t2);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(182:12) {#if findObjectById(a.agent[0].id)?.sameAs}",
    		ctx
    	});

    	return block;
    }

    // (187:12) {#if Array.isArray(findObjectById(a.agent[0].id)?.memberOf)}
    function create_if_block_4$1(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*findObjectById*/ ctx[4](/*a*/ ctx[10].agent[0].id)?.memberOf;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*findObjectById, mergedAttributions*/ 144) {
    				each_value_1 = /*findObjectById*/ ctx[4](/*a*/ ctx[10].agent[0].id)?.memberOf;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(187:12) {#if Array.isArray(findObjectById(a.agent[0].id)?.memberOf)}",
    		ctx
    	});

    	return block;
    }

    // (188:14) {#each findObjectById(a.agent[0].id)?.memberOf as o}
    function create_each_block_1$2(ctx) {
    	let div;
    	let t_value = /*findObjectById*/ ctx[4](/*o*/ ctx[13].id).name + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			add_location(div, file$a, 188, 16, 6952);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(188:14) {#each findObjectById(a.agent[0].id)?.memberOf as o}",
    		ctx
    	});

    	return block;
    }

    // (196:10) {#if findObjectById(a.agent[0].id)?.email && Array.isArray(findObjectById(a.agent[0].id)?.email)}
    function create_if_block_2$2(ctx) {
    	let a;
    	let t_value = /*findObjectById*/ ctx[4](/*a*/ ctx[10].agent[0].id)?.email[0] + "";
    	let t;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "class", "email svelte-tzyzs0");
    			attr_dev(a, "href", "mailto:" + /*findObjectById*/ ctx[4](/*a*/ ctx[10].agent[0].id)?.email[0]);
    			add_location(a, file$a, 196, 12, 7314);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(196:10) {#if findObjectById(a.agent[0].id)?.email && Array.isArray(findObjectById(a.agent[0].id)?.email)}",
    		ctx
    	});

    	return block;
    }

    // (178:6) {#each mergedAttributions as a}
    function create_each_block$4(ctx) {
    	let div1;
    	let div0;
    	let t0_value = /*a*/ ctx[10].role.join(", ") + "";
    	let t0;
    	let t1;
    	let t2;
    	let show_if = /*findObjectById*/ ctx[4](/*a*/ ctx[10].agent[0].id)?.email && Array.isArray(/*findObjectById*/ ctx[4](/*a*/ ctx[10].agent[0].id)?.email);
    	let t3;

    	function select_block_type_3(ctx, dirty) {
    		if (/*findObjectById*/ ctx[4](/*a*/ ctx[10].agent[0].id).type === "http://ns.dasch.swiss/repository#Person") return create_if_block_3$1;
    		return create_else_block_1$1;
    	}

    	let current_block_type = select_block_type_3(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = show_if && create_if_block_2$2(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			attr_dev(div0, "class", "role svelte-tzyzs0");
    			add_location(div0, file$a, 179, 10, 6176);
    			attr_dev(div1, "class", "attributions data svelte-tzyzs0");
    			add_location(div1, file$a, 178, 8, 6134);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div1, t1);
    			if_block0.m(div1, null);
    			append_dev(div1, t2);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t3);
    		},
    		p: function update(ctx, dirty) {
    			if_block0.p(ctx, dirty);
    			if (show_if) if_block1.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(178:6) {#each mergedAttributions as a}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div;
    	let div_intro;
    	let if_block = /*dataset*/ ctx[0] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "id", "dataset");
    			add_location(div, file$a, 64, 0, 2081);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*dataset*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fade, { duration: 200 });
    					div_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let $currentProjectMetadata;
    	validate_store(currentProjectMetadata, "currentProjectMetadata");
    	component_subscribe($$self, currentProjectMetadata, $$value => $$invalidate(8, $currentProjectMetadata = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("DefaultTabComponent", slots, []);
    	let { dataset } = $$props;
    	let isAbstractExpanded;
    	let abstractLinesNumber;

    	const toggleExpand = () => {
    		$$invalidate(1, isAbstractExpanded = !isAbstractExpanded);
    	};

    	const findObjectById = id => {
    		return $currentProjectMetadata?.metadata.find(obj => obj.id === id);
    	};

    	onMount(() => {
    		const el = document.getElementById("abstract");
    		const lineHeight = parseInt(window.getComputedStyle(el).getPropertyValue("line-height"));
    		const divHeight = el.scrollHeight;
    		$$invalidate(2, abstractLinesNumber = divHeight / lineHeight);
    		$$invalidate(1, isAbstractExpanded = abstractLinesNumber > 6 ? false : true);
    	});

    	const copyToClipboard = () => {
    		let text = document.createRange();
    		text.selectNode(document.getElementById("how-to-cite"));
    		window.getSelection().removeAllRanges();
    		window.getSelection().addRange(text);
    		document.execCommand("copy");
    		window.getSelection().removeAllRanges();

    		handleSnackbar.set({
    			isSnackbar: true,
    			message: "Citation copied succesfully!"
    		});
    	};

    	const truncateString = s => {
    		const browserWidth = window.innerWidth;

    		if (browserWidth < 992 && s.length > (browserWidth - 100) / 8) {
    			return `${s.substring(0, (browserWidth - 100) / 8)}...`;
    		} else if (browserWidth >= 992 && s.length > browserWidth / 17) {
    			return `${s.substring(0, browserWidth / 17)}...`;
    		} else return s;
    	};

    	let mergedAttributions = [];
    	const attributions = JSON.parse(JSON.stringify(dataset?.content.qualifiedAttribution));

    	for (let a of attributions) {
    		if (!mergedAttributions.length) {
    			mergedAttributions.push(a);
    		} else {
    			mergedAttributions.push(a);

    			for (let b of mergedAttributions) {
    				if (a.agent[0].id === b.agent[0].id && a.role !== b.role) {
    					b.role.push(a.role[0]);
    					mergedAttributions.splice(mergedAttributions.indexOf(a), 1);
    				}
    			}
    		}
    	}

    	console.log("loaded dataset", dataset);
    	const writable_props = ["dataset"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$2.warn(`<DefaultTabComponent> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("dataset" in $$props) $$invalidate(0, dataset = $$props.dataset);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		fade,
    		currentProjectMetadata,
    		handleSnackbar,
    		dataset,
    		isAbstractExpanded,
    		abstractLinesNumber,
    		toggleExpand,
    		findObjectById,
    		copyToClipboard,
    		truncateString,
    		mergedAttributions,
    		attributions,
    		$currentProjectMetadata
    	});

    	$$self.$inject_state = $$props => {
    		if ("dataset" in $$props) $$invalidate(0, dataset = $$props.dataset);
    		if ("isAbstractExpanded" in $$props) $$invalidate(1, isAbstractExpanded = $$props.isAbstractExpanded);
    		if ("abstractLinesNumber" in $$props) $$invalidate(2, abstractLinesNumber = $$props.abstractLinesNumber);
    		if ("mergedAttributions" in $$props) $$invalidate(7, mergedAttributions = $$props.mergedAttributions);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		dataset,
    		isAbstractExpanded,
    		abstractLinesNumber,
    		toggleExpand,
    		findObjectById,
    		copyToClipboard,
    		truncateString,
    		mergedAttributions
    	];
    }

    class DefaultTabComponent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { dataset: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DefaultTabComponent",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*dataset*/ ctx[0] === undefined && !("dataset" in props)) {
    			console_1$2.warn("<DefaultTabComponent> was created without expected prop 'dataset'");
    		}
    	}

    	get dataset() {
    		throw new Error("<DefaultTabComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dataset(value) {
    		throw new Error("<DefaultTabComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* services/metadata/frontend/project-page/Tab.svelte generated by Svelte v3.32.1 */
    const file$b = "services/metadata/frontend/project-page/Tab.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (12:6) {:else}
    function create_else_block$4(ctx) {
    	let span;
    	let t_value = /*tab*/ ctx[3].label + "";
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "svelte-7g4sc9");
    			add_location(span, file$b, 12, 8, 508);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);

    			if (!mounted) {
    				dispose = listen_dev(
    					span,
    					"click",
    					function () {
    						if (is_function(/*handleTabsBrowsing*/ ctx[2](/*tab*/ ctx[3].value))) /*handleTabsBrowsing*/ ctx[2](/*tab*/ ctx[3].value).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*tabs*/ 2 && t_value !== (t_value = /*tab*/ ctx[3].label + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(12:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (10:6) {#if tabs.length > 1 && activeTabValue !== tab.value}
    function create_if_block_1$4(ctx) {
    	let span;
    	let t_value = `${/*tab*/ ctx[3].label.substring(0, 5)}...` + "";
    	let t;
    	let span_title_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "title", span_title_value = /*tab*/ ctx[3].label);
    			attr_dev(span, "class", "svelte-7g4sc9");
    			add_location(span, file$b, 10, 8, 379);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);

    			if (!mounted) {
    				dispose = listen_dev(
    					span,
    					"click",
    					function () {
    						if (is_function(/*handleTabsBrowsing*/ ctx[2](/*tab*/ ctx[3].value))) /*handleTabsBrowsing*/ ctx[2](/*tab*/ ctx[3].value).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*tabs*/ 2 && t_value !== (t_value = `${/*tab*/ ctx[3].label.substring(0, 5)}...` + "")) set_data_dev(t, t_value);

    			if (dirty & /*tabs*/ 2 && span_title_value !== (span_title_value = /*tab*/ ctx[3].label)) {
    				attr_dev(span, "title", span_title_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(10:6) {#if tabs.length > 1 && activeTabValue !== tab.value}",
    		ctx
    	});

    	return block;
    }

    // (8:2) {#each tabs as tab}
    function create_each_block_1$3(ctx) {
    	let li;
    	let t;
    	let li_class_value;

    	function select_block_type(ctx, dirty) {
    		if (/*tabs*/ ctx[1].length > 1 && /*activeTabValue*/ ctx[0] !== /*tab*/ ctx[3].value) return create_if_block_1$4;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			li = element("li");
    			if_block.c();
    			t = space();

    			attr_dev(li, "class", li_class_value = "" + (null_to_empty(/*activeTabValue*/ ctx[0] === /*tab*/ ctx[3].value
    			? "active"
    			: "") + " svelte-7g4sc9"));

    			add_location(li, file$b, 8, 4, 253);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			if_block.m(li, null);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(li, t);
    				}
    			}

    			if (dirty & /*activeTabValue, tabs*/ 3 && li_class_value !== (li_class_value = "" + (null_to_empty(/*activeTabValue*/ ctx[0] === /*tab*/ ctx[3].value
    			? "active"
    			: "") + " svelte-7g4sc9"))) {
    				attr_dev(li, "class", li_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$3.name,
    		type: "each",
    		source: "(8:2) {#each tabs as tab}",
    		ctx
    	});

    	return block;
    }

    // (19:1) {#if activeTabValue === tab.value}
    function create_if_block$6(ctx) {
    	let div;
    	let switch_instance;
    	let t;
    	let current;
    	var switch_value = DefaultTabComponent;

    	function switch_props(ctx) {
    		return {
    			props: { dataset: /*tab*/ ctx[3] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			t = space();
    			attr_dev(div, "class", "box svelte-7g4sc9");
    			add_location(div, file$b, 19, 4, 672);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, div, null);
    			}

    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*tabs*/ 2) switch_instance_changes.dataset = /*tab*/ ctx[3];

    			if (switch_value !== (switch_value = DefaultTabComponent)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, t);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (switch_instance) destroy_component(switch_instance);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(19:1) {#if activeTabValue === tab.value}",
    		ctx
    	});

    	return block;
    }

    // (18:0) {#each tabs as tab}
    function create_each_block$5(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*activeTabValue*/ ctx[0] === /*tab*/ ctx[3].value && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*activeTabValue*/ ctx[0] === /*tab*/ ctx[3].value) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*activeTabValue, tabs*/ 3) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(18:0) {#each tabs as tab}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let ul;
    	let t;
    	let each1_anchor;
    	let current;
    	let each_value_1 = /*tabs*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$3(get_each_context_1$3(ctx, each_value_1, i));
    	}

    	let each_value = /*tabs*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each1_anchor = empty();
    			attr_dev(ul, "class", "svelte-7g4sc9");
    			add_location(ul, file$b, 6, 0, 222);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(ul, null);
    			}

    			insert_dev(target, t, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*activeTabValue, tabs, handleTabsBrowsing*/ 7) {
    				each_value_1 = /*tabs*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$3(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$3(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*DefaultTabComponent, tabs, activeTabValue*/ 3) {
    				each_value = /*tabs*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each1_anchor.parentNode, each1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Tab", slots, []);
    	let { tabs = [] } = $$props;
    	let { activeTabValue = 0 } = $$props;
    	const handleTabsBrowsing = tabValue => () => $$invalidate(0, activeTabValue = tabValue);
    	const writable_props = ["tabs", "activeTabValue"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tab> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("tabs" in $$props) $$invalidate(1, tabs = $$props.tabs);
    		if ("activeTabValue" in $$props) $$invalidate(0, activeTabValue = $$props.activeTabValue);
    	};

    	$$self.$capture_state = () => ({
    		DefaultTabComponent,
    		tabs,
    		activeTabValue,
    		handleTabsBrowsing
    	});

    	$$self.$inject_state = $$props => {
    		if ("tabs" in $$props) $$invalidate(1, tabs = $$props.tabs);
    		if ("activeTabValue" in $$props) $$invalidate(0, activeTabValue = $$props.activeTabValue);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [activeTabValue, tabs, handleTabsBrowsing];
    }

    class Tab extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { tabs: 1, activeTabValue: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tab",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get tabs() {
    		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabs(value) {
    		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeTabValue() {
    		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeTabValue(value) {
    		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* services/metadata/frontend/project-page/ProjectPage.svelte generated by Svelte v3.32.1 */

    const { console: console_1$3 } = globals;
    const file$c = "services/metadata/frontend/project-page/ProjectPage.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	child_ctx[21] = i;
    	return child_ctx;
    }

    // (68:0) {#if $handleSnackbar.isSnackbar}
    function create_if_block_5$2(ctx) {
    	let div;
    	let switch_instance;
    	let current;
    	var switch_value = Snackbar;

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			add_location(div, file$c, 68, 2, 3063);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = Snackbar)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, null);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (switch_instance) destroy_component(switch_instance);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$2.name,
    		type: "if",
    		source: "(68:0) {#if $handleSnackbar.isSnackbar}",
    		ctx
    	});

    	return block;
    }

    // (79:4) {#if $currentProject?.alternateName}
    function create_if_block_4$2(ctx) {
    	let div;
    	let h4;
    	let t0;
    	let span;
    	let t1_value = /*$currentProject*/ ctx[3]?.alternateName.join(", ") + "";
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h4 = element("h4");
    			t0 = text("Also known as: \n        ");
    			span = element("span");
    			t1 = text(t1_value);
    			set_style(span, "color", "var(--secondary-colour)");
    			add_location(span, file$c, 82, 8, 3431);
    			attr_dev(h4, "class", "title new-title svelte-1xxonsd");
    			add_location(h4, file$c, 80, 6, 3365);
    			attr_dev(div, "class", "row svelte-1xxonsd");
    			add_location(div, file$c, 79, 4, 3341);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h4);
    			append_dev(h4, t0);
    			append_dev(h4, span);
    			append_dev(span, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentProject*/ 8 && t1_value !== (t1_value = /*$currentProject*/ ctx[3]?.alternateName.join(", ") + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(79:4) {#if $currentProject?.alternateName}",
    		ctx
    	});

    	return block;
    }

    // (95:6) {#if descriptionLinesNumber > 6}
    function create_if_block_3$2(ctx) {
    	let div;
    	let t0;
    	let t1_value = (/*isDescriptionExpanded*/ ctx[0] ? "less" : "more") + "";
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("show ");
    			t1 = text(t1_value);
    			attr_dev(div, "class", "expand-button");
    			add_location(div, file$c, 95, 8, 3991);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*toggleDescriptionExpand*/ ctx[8], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*isDescriptionExpanded*/ 1 && t1_value !== (t1_value = (/*isDescriptionExpanded*/ ctx[0] ? "less" : "more") + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(95:6) {#if descriptionLinesNumber > 6}",
    		ctx
    	});

    	return block;
    }

    // (99:6) {#if $currentProject?.publication && Array.isArray($currentProject?.publication)}
    function create_if_block$7(ctx) {
    	let div;
    	let span;
    	let t1;
    	let t2;
    	let if_block_anchor;
    	let each_value = /*$currentProject*/ ctx[3]?.publication;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	let if_block = /*$currentProject*/ ctx[3]?.publication.length > 2 && create_if_block_1$5(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "Publications";
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(span, "class", "label new-subtitle");
    			add_location(span, file$c, 100, 10, 4250);
    			attr_dev(div, "class", "property-row");
    			add_location(div, file$c, 99, 8, 4213);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(div, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			insert_dev(target, t2, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*arePublicationsExpanded, $currentProject*/ 12) {
    				each_value = /*$currentProject*/ ctx[3]?.publication;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*$currentProject*/ ctx[3]?.publication.length > 2) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$5(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(99:6) {#if $currentProject?.publication && Array.isArray($currentProject?.publication)}",
    		ctx
    	});

    	return block;
    }

    // (105:14) {:else}
    function create_else_block$5(ctx) {
    	let span;
    	let t_value = /*p*/ ctx[19] + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "data new-text");
    			add_location(span, file$c, 105, 16, 4520);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentProject*/ 8 && t_value !== (t_value = /*p*/ ctx[19] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(105:14) {:else}",
    		ctx
    	});

    	return block;
    }

    // (103:14) {#if i > 1}
    function create_if_block_2$3(ctx) {
    	let span;
    	let t_value = /*p*/ ctx[19] + "";
    	let t;
    	let span_class_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);

    			attr_dev(span, "class", span_class_value = /*arePublicationsExpanded*/ ctx[2]
    			? "data new-text"
    			: "hidden");

    			add_location(span, file$c, 103, 16, 4402);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentProject*/ 8 && t_value !== (t_value = /*p*/ ctx[19] + "")) set_data_dev(t, t_value);

    			if (dirty & /*arePublicationsExpanded*/ 4 && span_class_value !== (span_class_value = /*arePublicationsExpanded*/ ctx[2]
    			? "data new-text"
    			: "hidden")) {
    				attr_dev(span, "class", span_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(103:14) {#if i > 1}",
    		ctx
    	});

    	return block;
    }

    // (102:12) {#each $currentProject?.publication as p, i}
    function create_each_block$6(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*i*/ ctx[21] > 1) return create_if_block_2$3;
    		return create_else_block$5;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(102:12) {#each $currentProject?.publication as p, i}",
    		ctx
    	});

    	return block;
    }

    // (111:8) {#if $currentProject?.publication.length > 2}
    function create_if_block_1$5(ctx) {
    	let div;
    	let t0;
    	let t1_value = (/*arePublicationsExpanded*/ ctx[2] ? "less" : "more") + "";
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("show ");
    			t1 = text(t1_value);
    			attr_dev(div, "class", "expand-button");
    			add_location(div, file$c, 111, 10, 4679);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*togglePublicationExpand*/ ctx[9], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*arePublicationsExpanded*/ 4 && t1_value !== (t1_value = (/*arePublicationsExpanded*/ ctx[2] ? "less" : "more") + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(111:8) {#if $currentProject?.publication.length > 2}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script lang='ts'>var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {     function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }
    function create_catch_block(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(1:0) <script lang='ts'>var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {     function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }",
    		ctx
    	});

    	return block;
    }

    // (117:43)          <div class="tabs">           <Tab {tabs}
    function create_then_block(ctx) {
    	let div;
    	let tab;
    	let current;

    	tab = new Tab({
    			props: { tabs: /*tabs*/ ctx[6] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(tab.$$.fragment);
    			attr_dev(div, "class", "tabs");
    			add_location(div, file$c, 117, 8, 4874);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(tab, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tab.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tab.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(tab);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(117:43)          <div class=\\\"tabs\\\">           <Tab {tabs}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script lang='ts'>var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {     function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }
    function create_pending_block(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(1:0) <script lang='ts'>var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {     function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let t0;
    	let div7;
    	let div0;
    	let h1;
    	let t1_value = /*$currentProject*/ ctx[3]?.name + "";
    	let t1;
    	let t2;
    	let t3;
    	let div6;
    	let div3;
    	let div2;
    	let span0;
    	let t5;
    	let div1;
    	let t6_value = /*$currentProject*/ ctx[3]?.description + "";
    	let t6;
    	let div1_class_value;
    	let t7;
    	let t8;
    	let show_if = /*$currentProject*/ ctx[3]?.publication && Array.isArray(/*$currentProject*/ ctx[3]?.publication);
    	let t9;
    	let t10;
    	let button0;
    	let svg0;
    	let path0;
    	let t11;
    	let div5;
    	let button1;
    	let svg1;
    	let path1;
    	let t12;
    	let span1;
    	let button1_disabled_value;
    	let t14;
    	let div4;
    	let projectwidget;
    	let t15;
    	let button2;
    	let svg2;
    	let path2;
    	let div7_intro;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*$handleSnackbar*/ ctx[4].isSnackbar && create_if_block_5$2(ctx);
    	let if_block1 = /*$currentProject*/ ctx[3]?.alternateName && create_if_block_4$2(ctx);
    	let if_block2 = /*descriptionLinesNumber*/ ctx[1] > 6 && create_if_block_3$2(ctx);
    	let if_block3 = show_if && create_if_block$7(ctx);

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 18,
    		blocks: [,,,]
    	};

    	handle_promise(/*getProjectMetadata*/ ctx[7](), info);
    	projectwidget = new ProjectWidget({ $$inline: true });

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div7 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			t1 = text(t1_value);
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			div6 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			span0 = element("span");
    			span0.textContent = "Description";
    			t5 = space();
    			div1 = element("div");
    			t6 = text(t6_value);
    			t7 = space();
    			if (if_block2) if_block2.c();
    			t8 = space();
    			if (if_block3) if_block3.c();
    			t9 = space();
    			info.block.c();
    			t10 = space();
    			button0 = element("button");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t11 = space();
    			div5 = element("div");
    			button1 = element("button");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t12 = space();
    			span1 = element("span");
    			span1.textContent = "Go Back";
    			t14 = space();
    			div4 = element("div");
    			create_component(projectwidget.$$.fragment);
    			t15 = space();
    			button2 = element("button");
    			svg2 = svg_element("svg");
    			path2 = svg_element("path");
    			attr_dev(h1, "class", "title top-heading svelte-1xxonsd");
    			add_location(h1, file$c, 75, 4, 3225);
    			attr_dev(div0, "class", "row svelte-1xxonsd");
    			set_style(div0, "flex-wrap", "wrap");
    			add_location(div0, file$c, 74, 2, 3178);
    			attr_dev(span0, "class", "label new-subtitle");
    			add_location(span0, file$c, 90, 8, 3659);
    			attr_dev(div1, "id", "description");

    			attr_dev(div1, "class", div1_class_value = "data new-text " + (/*isDescriptionExpanded*/ ctx[0]
    			? ""
    			: "description-short") + " svelte-1xxonsd");

    			add_location(div1, file$c, 91, 8, 3719);
    			attr_dev(div2, "class", "property-row");
    			add_location(div2, file$c, 89, 6, 3624);
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			attr_dev(path0, "stroke-width", "2");
    			attr_dev(path0, "d", "M5 10l7-7m0 0l7 7m-7-7v18");
    			add_location(path0, file$c, 124, 10, 5226);
    			attr_dev(svg0, "class", "icon");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "stroke", "currentColor");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg0, file$c, 123, 8, 5110);
    			attr_dev(button0, "id", "to-top-desktop");
    			attr_dev(button0, "class", "bottom-button svelte-1xxonsd");
    			attr_dev(button0, "title", "Get back to the top");
    			add_location(button0, file$c, 122, 6, 4955);
    			attr_dev(div3, "class", "column-left svelte-1xxonsd");
    			add_location(div3, file$c, 88, 4, 3592);
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke-linejoin", "round");
    			attr_dev(path1, "stroke-width", "2");
    			attr_dev(path1, "d", "M10 19l-7-7m0 0l7-7m-7 7h18");
    			add_location(path1, file$c, 132, 113, 5834);
    			attr_dev(svg1, "class", "icon");
    			attr_dev(svg1, "fill", "none");
    			attr_dev(svg1, "stroke", "currentColor");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg1, file$c, 132, 8, 5729);
    			attr_dev(span1, "class", "button-label svelte-1xxonsd");
    			add_location(span1, file$c, 133, 8, 5958);
    			attr_dev(button1, "class", "top-button svelte-1xxonsd");
    			attr_dev(button1, "title", "go back to the projects list");
    			button1.disabled = button1_disabled_value = !/*$previousRoute*/ ctx[5] && window.history.length <= 2;
    			add_location(button1, file$c, 131, 8, 5569);
    			attr_dev(div4, "class", "widget svelte-1xxonsd");
    			add_location(div4, file$c, 135, 6, 6020);
    			attr_dev(path2, "stroke-linecap", "round");
    			attr_dev(path2, "stroke-linejoin", "round");
    			attr_dev(path2, "stroke-width", "2");
    			attr_dev(path2, "d", "M5 10l7-7m0 0l7 7m-7-7v18");
    			add_location(path2, file$c, 145, 10, 6442);
    			attr_dev(svg2, "class", "icon");
    			attr_dev(svg2, "fill", "none");
    			attr_dev(svg2, "stroke", "currentColor");
    			attr_dev(svg2, "viewBox", "0 0 24 24");
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg2, file$c, 144, 8, 6326);
    			attr_dev(button2, "class", "bottom-button m-hidden svelte-1xxonsd");
    			attr_dev(button2, "title", "Get back to the top");
    			add_location(button2, file$c, 143, 6, 6210);
    			attr_dev(div5, "class", "column-right svelte-1xxonsd");
    			add_location(div5, file$c, 129, 4, 5376);
    			attr_dev(div6, "class", "row svelte-1xxonsd");
    			add_location(div6, file$c, 87, 2, 3570);
    			attr_dev(div7, "class", "container svelte-1xxonsd");
    			add_location(div7, file$c, 73, 0, 3126);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div0);
    			append_dev(div0, h1);
    			append_dev(h1, t1);
    			append_dev(div0, t2);
    			if (if_block1) if_block1.m(div0, null);
    			append_dev(div7, t3);
    			append_dev(div7, div6);
    			append_dev(div6, div3);
    			append_dev(div3, div2);
    			append_dev(div2, span0);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			append_dev(div1, t6);
    			append_dev(div3, t7);
    			if (if_block2) if_block2.m(div3, null);
    			append_dev(div3, t8);
    			if (if_block3) if_block3.m(div3, null);
    			append_dev(div3, t9);
    			info.block.m(div3, info.anchor = null);
    			info.mount = () => div3;
    			info.anchor = t10;
    			append_dev(div3, t10);
    			append_dev(div3, button0);
    			append_dev(button0, svg0);
    			append_dev(svg0, path0);
    			append_dev(div6, t11);
    			append_dev(div6, div5);
    			append_dev(div5, button1);
    			append_dev(button1, svg1);
    			append_dev(svg1, path1);
    			append_dev(button1, t12);
    			append_dev(button1, span1);
    			append_dev(div5, t14);
    			append_dev(div5, div4);
    			mount_component(projectwidget, div4, null);
    			append_dev(div5, t15);
    			append_dev(div5, button2);
    			append_dev(button2, svg2);
    			append_dev(svg2, path2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[10], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[11], false, false, false),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[12], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (/*$handleSnackbar*/ ctx[4].isSnackbar) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*$handleSnackbar*/ 16) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_5$2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if ((!current || dirty & /*$currentProject*/ 8) && t1_value !== (t1_value = /*$currentProject*/ ctx[3]?.name + "")) set_data_dev(t1, t1_value);

    			if (/*$currentProject*/ ctx[3]?.alternateName) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_4$2(ctx);
    					if_block1.c();
    					if_block1.m(div0, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if ((!current || dirty & /*$currentProject*/ 8) && t6_value !== (t6_value = /*$currentProject*/ ctx[3]?.description + "")) set_data_dev(t6, t6_value);

    			if (!current || dirty & /*isDescriptionExpanded*/ 1 && div1_class_value !== (div1_class_value = "data new-text " + (/*isDescriptionExpanded*/ ctx[0]
    			? ""
    			: "description-short") + " svelte-1xxonsd")) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (/*descriptionLinesNumber*/ ctx[1] > 6) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_3$2(ctx);
    					if_block2.c();
    					if_block2.m(div3, t8);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (dirty & /*$currentProject*/ 8) show_if = /*$currentProject*/ ctx[3]?.publication && Array.isArray(/*$currentProject*/ ctx[3]?.publication);

    			if (show_if) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block$7(ctx);
    					if_block3.c();
    					if_block3.m(div3, t9);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			{
    				const child_ctx = ctx.slice();
    				child_ctx[18] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}

    			if (!current || dirty & /*$previousRoute*/ 32 && button1_disabled_value !== (button1_disabled_value = !/*$previousRoute*/ ctx[5] && window.history.length <= 2)) {
    				prop_dev(button1, "disabled", button1_disabled_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(info.block);
    			transition_in(projectwidget.$$.fragment, local);

    			if (!div7_intro) {
    				add_render_callback(() => {
    					div7_intro = create_in_transition(div7, fade, { duration: 200 });
    					div7_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);

    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			transition_out(projectwidget.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div7);
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			info.block.d();
    			info.token = null;
    			info = null;
    			destroy_component(projectwidget);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let $currentProjectMetadata;
    	let $currentProject;
    	let $handleSnackbar;
    	let $previousRoute;
    	validate_store(currentProjectMetadata, "currentProjectMetadata");
    	component_subscribe($$self, currentProjectMetadata, $$value => $$invalidate(14, $currentProjectMetadata = $$value));
    	validate_store(currentProject, "currentProject");
    	component_subscribe($$self, currentProject, $$value => $$invalidate(3, $currentProject = $$value));
    	validate_store(handleSnackbar, "handleSnackbar");
    	component_subscribe($$self, handleSnackbar, $$value => $$invalidate(4, $handleSnackbar = $$value));
    	validate_store(previousRoute, "previousRoute");
    	component_subscribe($$self, previousRoute, $$value => $$invalidate(5, $previousRoute = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ProjectPage", slots, []);

    	var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    		function adopt(value) {
    			return value instanceof P
    			? value
    			: new P(function (resolve) {
    						resolve(value);
    					});
    		}

    		return new (P || (P = Promise))(function (resolve, reject) {
    				function fulfilled(value) {
    					try {
    						step(generator.next(value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function rejected(value) {
    					try {
    						step(generator["throw"](value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function step(result) {
    					result.done
    					? resolve(result.value)
    					: adopt(result.value).then(fulfilled, rejected);
    				}

    				step((generator = generator.apply(thisArg, _arguments || [])).next());
    			});
    	};

    	let datasets = [];
    	let tabs = [];
    	let isDescriptionExpanded;
    	let descriptionLinesNumber;
    	let arePublicationsExpanded;

    	const getProjectMetadata = () => __awaiter(void 0, void 0, void 0, function* () {
    		const protocol = window.location.protocol;
    		const port = protocol === "https:" ? "" : ":3000";
    		const baseUrl = `${protocol}//${window.location.hostname}${port}/`;
    		const projectID = window.location.pathname.split("/")[2];
    		const res = yield fetch(`${baseUrl}api/v1/projects/${projectID}`);
    		const projectMetadata = yield res.json();
    		currentProjectMetadata.set(projectMetadata);
    		const project = $currentProjectMetadata.metadata.find(p => p.type === "http://ns.dasch.swiss/repository#Project");
    		currentProject.set(project);
    		document.title = project.name;
    		datasets = $currentProjectMetadata.metadata.filter(p => p.type === "http://ns.dasch.swiss/repository#Dataset");

    		datasets.forEach(d => tabs.push({
    			label: d.title,
    			value: datasets.indexOf(d),
    			content: d
    		}));

    		yield tick();
    		getDivHeight();
    		console.log("metadata", projectMetadata, "project", $currentProject);
    	});

    	const handleData = val => {
    		if (Array.isArray(val) && val.length > 1) {
    			return val.join(", ");
    		} else {
    			return val;
    		}
    	};

    	const toggleDescriptionExpand = () => {
    		$$invalidate(0, isDescriptionExpanded = !isDescriptionExpanded);
    		!isDescriptionExpanded ? window.scrollTo(0, 0) : null;
    	};

    	const togglePublicationExpand = () => {
    		$$invalidate(2, arePublicationsExpanded = !arePublicationsExpanded);

    		!arePublicationsExpanded
    		? window.scrollTo(0, 300)
    		: null;
    	};

    	const getDivHeight = () => {
    		const el = document.getElementById("description");
    		const lineHeight = parseInt(window.getComputedStyle(el).getPropertyValue("line-height"));
    		const divHeight = el.scrollHeight;
    		$$invalidate(1, descriptionLinesNumber = divHeight / lineHeight);
    		$$invalidate(0, isDescriptionExpanded = descriptionLinesNumber > 6 ? false : true);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$3.warn(`<ProjectPage> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    	const click_handler_1 = () => history.back();

    	const click_handler_2 = () => {
    		window.scrollTo(0, 0);
    	};

    	$$self.$capture_state = () => ({
    		__awaiter,
    		tick,
    		currentProject,
    		currentProjectMetadata,
    		handleSnackbar,
    		previousRoute,
    		ProjectWidget,
    		DownloadWidget,
    		Tab,
    		fade,
    		Snackbar,
    		datasets,
    		tabs,
    		isDescriptionExpanded,
    		descriptionLinesNumber,
    		arePublicationsExpanded,
    		getProjectMetadata,
    		handleData,
    		toggleDescriptionExpand,
    		togglePublicationExpand,
    		getDivHeight,
    		$currentProjectMetadata,
    		$currentProject,
    		$handleSnackbar,
    		$previousRoute
    	});

    	$$self.$inject_state = $$props => {
    		if ("__awaiter" in $$props) __awaiter = $$props.__awaiter;
    		if ("datasets" in $$props) datasets = $$props.datasets;
    		if ("tabs" in $$props) $$invalidate(6, tabs = $$props.tabs);
    		if ("isDescriptionExpanded" in $$props) $$invalidate(0, isDescriptionExpanded = $$props.isDescriptionExpanded);
    		if ("descriptionLinesNumber" in $$props) $$invalidate(1, descriptionLinesNumber = $$props.descriptionLinesNumber);
    		if ("arePublicationsExpanded" in $$props) $$invalidate(2, arePublicationsExpanded = $$props.arePublicationsExpanded);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		isDescriptionExpanded,
    		descriptionLinesNumber,
    		arePublicationsExpanded,
    		$currentProject,
    		$handleSnackbar,
    		$previousRoute,
    		tabs,
    		getProjectMetadata,
    		toggleDescriptionExpand,
    		togglePublicationExpand,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class ProjectPage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProjectPage",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* services/metadata/frontend/Redirect.svelte generated by Svelte v3.32.1 */

    function create_fragment$f(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Redirect", slots, []);
    	let { to } = $$props;

    	onMount(() => {
    		navigate(to);
    	});

    	const writable_props = ["to"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Redirect> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("to" in $$props) $$invalidate(0, to = $$props.to);
    	};

    	$$self.$capture_state = () => ({ onMount, navigate, to });

    	$$self.$inject_state = $$props => {
    		if ("to" in $$props) $$invalidate(0, to = $$props.to);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [to];
    }

    class Redirect extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { to: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Redirect",
    			options,
    			id: create_fragment$f.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*to*/ ctx[0] === undefined && !("to" in props)) {
    			console.warn("<Redirect> was created without expected prop 'to'");
    		}
    	}

    	get to() {
    		throw new Error("<Redirect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Redirect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var setCookie = function (name, value, days, path) {
        if (days === void 0) { days = 90; }
        if (path === void 0) { path = '/'; }
        var domain = 'dasch.swiss';
        var expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = name + "=" + encodeURIComponent(value) + "; domain=" + domain + "; expires=" + expires + "; path=" + path;
    };
    var getCookie = function (name) {
        return document.cookie.split('; ').reduce(function (r, v) {
            var parts = v.split('=');
            return parts[0] === name ? decodeURIComponent(parts[1]) : r;
        }, '');
    };
    var cookiesAgreement = writable(getCookie('cookiesAgreement') === 'true' || false);

    /* services/metadata/frontend/GTag.svelte generated by Svelte v3.32.1 */

    function create_fragment$g(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const hostname = "meta.dasch.swiss";

    function instance$g($$self, $$props, $$invalidate) {
    	let $cookiesAgreement;
    	validate_store(cookiesAgreement, "cookiesAgreement");
    	component_subscribe($$self, cookiesAgreement, $$value => $$invalidate(0, $cookiesAgreement = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("GTag", slots, []);
    	window.gtag = {};

    	window.gtag.update = function () {
    		gTag();
    	};

    	const gTag = () => {
    		if (window.location.hostname === hostname && $cookiesAgreement) {
    			window.dataLayer = window.dataLayer || [];

    			function gtag() {
    				dataLayer.push(arguments);
    			}

    			gtag("js", new Date());
    			gtag("config", "G-9MD8RKZJHE");
    		}

    		
    	};

    	gTag();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<GTag> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		cookiesAgreement,
    		hostname,
    		gTag,
    		$cookiesAgreement
    	});

    	return [];
    }

    class GTag extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GTag",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* services/metadata/frontend/CookiesBanner.svelte generated by Svelte v3.32.1 */
    const file$d = "services/metadata/frontend/CookiesBanner.svelte";

    // (17:0) {#if modalOn && noLocalhost}
    function create_if_block$8(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let t0;
    	let a0;
    	let t2;
    	let a1;
    	let t4;
    	let a2;
    	let t6;
    	let t7;
    	let div1;
    	let button0;
    	let t9;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text("DaSCH uses cookies to personalize content and analyze access to its websites. Find more information on\n        ");
    			a0 = element("a");
    			a0.textContent = "cookie policy";
    			t2 = text(",\n        ");
    			a1 = element("a");
    			a1.textContent = "EULA";
    			t4 = text(" and\n        ");
    			a2 = element("a");
    			a2.textContent = "privacy policy";
    			t6 = text(".");
    			t7 = space();
    			div1 = element("div");
    			button0 = element("button");
    			button0.textContent = "Accept only essential cookies";
    			t9 = space();
    			button1 = element("button");
    			button1.textContent = "Accept all cookies";
    			attr_dev(a0, "href", "https://dasch.swiss/cookie-policy/");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "class", "svelte-jb3x7g");
    			add_location(a0, file$d, 21, 8, 722);
    			attr_dev(a1, "href", "https://dasch.swiss/eula/");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "class", "svelte-jb3x7g");
    			add_location(a1, file$d, 22, 8, 808);
    			attr_dev(a2, "href", "https://dasch.swiss/privacy-policy/");
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "class", "svelte-jb3x7g");
    			add_location(a2, file$d, 23, 8, 879);
    			attr_dev(div0, "class", "modal-text svelte-jb3x7g");
    			add_location(div0, file$d, 19, 6, 578);
    			attr_dev(button0, "class", "btn-accept-necessary svelte-jb3x7g");
    			add_location(button0, file$d, 26, 8, 1014);
    			attr_dev(button1, "class", "btn-accept-all svelte-jb3x7g");
    			add_location(button1, file$d, 27, 8, 1129);
    			attr_dev(div1, "class", "modal-buttons svelte-jb3x7g");
    			add_location(div1, file$d, 25, 6, 978);
    			attr_dev(div2, "class", "modal-wrapper svelte-jb3x7g");
    			add_location(div2, file$d, 18, 4, 544);
    			attr_dev(div3, "id", "cookieConsent");
    			attr_dev(div3, "class", "svelte-jb3x7g");
    			add_location(div3, file$d, 17, 2, 515);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div0, a0);
    			append_dev(div0, t2);
    			append_dev(div0, a1);
    			append_dev(div0, t4);
    			append_dev(div0, a2);
    			append_dev(div0, t6);
    			append_dev(div2, t7);
    			append_dev(div2, div1);
    			append_dev(div1, button0);
    			append_dev(div1, t9);
    			append_dev(div1, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[3], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(17:0) {#if modalOn && noLocalhost}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let if_block_anchor;
    	let if_block = /*modalOn*/ ctx[0] && /*noLocalhost*/ ctx[1] && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*modalOn*/ ctx[0] && /*noLocalhost*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("CookiesBanner", slots, []);
    	const noLocalhost = window.location.hostname !== "localhost";
    	let modalOn = getCookie("cookiesAgreement") ? false : true;

    	const handleModal = all => {
    		$$invalidate(0, modalOn = !modalOn);

    		if (all) {
    			cookiesAgreement.set(true);
    			window.gtag.update();
    			setCookie("cookiesAgreement", "true");
    		} else {
    			setCookie("cookiesAgreement", "false");
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<CookiesBanner> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => handleModal();
    	const click_handler_1 = () => handleModal(true);

    	$$self.$capture_state = () => ({
    		cookiesAgreement,
    		getCookie,
    		setCookie,
    		noLocalhost,
    		modalOn,
    		handleModal
    	});

    	$$self.$inject_state = $$props => {
    		if ("modalOn" in $$props) $$invalidate(0, modalOn = $$props.modalOn);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [modalOn, noLocalhost, handleModal, click_handler, click_handler_1];
    }

    class CookiesBanner extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CookiesBanner",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* services/metadata/frontend/App.svelte generated by Svelte v3.32.1 */
    const file$e = "services/metadata/frontend/App.svelte";

    // (20:8) <Route path="/projects/:id">
    function create_default_slot_3(ctx) {
    	let projectpage;
    	let current;
    	projectpage = new ProjectPage({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(projectpage.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(projectpage, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(projectpage.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(projectpage.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(projectpage, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(20:8) <Route path=\\\"/projects/:id\\\">",
    		ctx
    	});

    	return block;
    }

    // (21:8) <Route path="/projects">
    function create_default_slot_2(ctx) {
    	let projectsrepository;
    	let current;
    	projectsrepository = new ProjectsRepository({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(projectsrepository.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(projectsrepository, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(projectsrepository.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(projectsrepository.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(projectsrepository, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(21:8) <Route path=\\\"/projects\\\">",
    		ctx
    	});

    	return block;
    }

    // (22:8) <Route path="/">
    function create_default_slot_1$2(ctx) {
    	let redirect;
    	let current;

    	redirect = new Redirect({
    			props: { to: "/projects?_page=1&_limit=9" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(redirect.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(redirect, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(redirect.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(redirect.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(redirect, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(22:8) <Route path=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (19:6) <Router url="{url}">
    function create_default_slot$2(ctx) {
    	let route0;
    	let t0;
    	let route1;
    	let t1;
    	let route2;
    	let current;

    	route0 = new Route({
    			props: {
    				path: "/projects/:id",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route({
    			props: {
    				path: "/projects",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route({
    			props: {
    				path: "/",
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route0.$$.fragment);
    			t0 = space();
    			create_component(route1.$$.fragment);
    			t1 = space();
    			create_component(route2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(route0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(route1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(route2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(route1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(route2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(19:6) <Router url=\\\"{url}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let gtag;
    	let t0;
    	let header;
    	let t1;
    	let div1;
    	let div0;
    	let router;
    	let t2;
    	let footer;
    	let t3;
    	let cookiesbanner;
    	let current;
    	gtag = new GTag({ $$inline: true });
    	header = new Header({ $$inline: true });

    	router = new Router({
    			props: {
    				url: /*url*/ ctx[0],
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	footer = new Footer({ $$inline: true });
    	cookiesbanner = new CookiesBanner({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(gtag.$$.fragment);
    			t0 = space();
    			create_component(header.$$.fragment);
    			t1 = space();
    			div1 = element("div");
    			div0 = element("div");
    			create_component(router.$$.fragment);
    			t2 = space();
    			create_component(footer.$$.fragment);
    			t3 = space();
    			create_component(cookiesbanner.$$.fragment);
    			attr_dev(div0, "class", "content-container svelte-5t0x8q");
    			add_location(div0, file$e, 17, 4, 523);
    			attr_dev(div1, "class", "wrapper svelte-5t0x8q");
    			add_location(div1, file$e, 16, 2, 499);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(gtag, document.head, null);
    			insert_dev(target, t0, anchor);
    			mount_component(header, target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(router, div0, null);
    			insert_dev(target, t2, anchor);
    			mount_component(footer, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(cookiesbanner, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};
    			if (dirty & /*url*/ 1) router_changes.url = /*url*/ ctx[0];

    			if (dirty & /*$$scope*/ 2) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(gtag.$$.fragment, local);
    			transition_in(header.$$.fragment, local);
    			transition_in(router.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			transition_in(cookiesbanner.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(gtag.$$.fragment, local);
    			transition_out(header.$$.fragment, local);
    			transition_out(router.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			transition_out(cookiesbanner.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(gtag);
    			if (detaching) detach_dev(t0);
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			destroy_component(router);
    			if (detaching) detach_dev(t2);
    			destroy_component(footer, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(cookiesbanner, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let { url = "" } = $$props;
    	const writable_props = ["url"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("url" in $$props) $$invalidate(0, url = $$props.url);
    	};

    	$$self.$capture_state = () => ({
    		Header,
    		Footer,
    		Router,
    		Route,
    		ProjectsRepository,
    		ProjectPage,
    		Redirect,
    		GTag,
    		CookiesBanner,
    		url
    	});

    	$$self.$inject_state = $$props => {
    		if ("url" in $$props) $$invalidate(0, url = $$props.url);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [url];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { url: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get url() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var app = new App({
        target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
