import { SQLite } from './snippets/sqlite-web-90f8afa7b0cd2303/src/js/sqlite3-diesel.js';

let wasm;

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_export_3.set(idx, obj);
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => {
    wasm.__wbindgen_export_6.get(state.dtor)(state.a, state.b)
});

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_6.get(state.dtor)(a, state.b);
                CLOSURE_DTORS.unregister(state);
            } else {
                state.a = a;
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(wasm.__wbindgen_export_3.get(mem.getUint32(i, true)));
    }
    wasm.__externref_drop_slice(ptr, len);
    return result;
}
/**
 * Run entry point for the main thread.
 */
export function startup() {
    wasm.startup();
}

function __wbg_adapter_42(arg0, arg1, arg2) {
    wasm.closure132_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_45(arg0, arg1) {
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h6becb480f13c0dbc(arg0, arg1);
}

function __wbg_adapter_48(arg0, arg1, arg2) {
    wasm.closure817_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_280(arg0, arg1, arg2, arg3) {
    wasm.closure883_externref_shim(arg0, arg1, arg2, arg3);
}

const __wbindgen_enum_WorkerType = ["classic", "module"];

const PostsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_posts_free(ptr >>> 0, 1));

export class Posts {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Posts.prototype);
        obj.__wbg_ptr = ptr;
        PostsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PostsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_posts_free(ptr, 0);
    }
    /**
     * @returns {Posts}
     */
    static new() {
        const ret = wasm.posts_new();
        return Posts.__wrap(ret);
    }
    /**
     * @returns {Promise<void>}
     */
    static init_sqlite() {
        const ret = wasm.posts_init_sqlite();
        return ret;
    }
    /**
     * @param {string} title
     * @param {string} body
     * @param {boolean} published
     * @returns {number}
     */
    create_post(title, body, published) {
        const ptr0 = passStringToWasm0(title, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(body, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.posts_create_post(this.__wbg_ptr, ptr0, len0, ptr1, len1, published);
        return ret >>> 0;
    }
    /**
     * @param {number} id
     * @returns {number}
     */
    delete_post(id) {
        const ret = wasm.posts_delete_post(this.__wbg_ptr, id);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    clear() {
        const ret = wasm.posts_clear(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {any[]}
     */
    list_posts() {
        const ret = wasm.posts_list_posts(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
}

const VersionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_version_free(ptr >>> 0, 1));

export class Version {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VersionFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_version_free(ptr, 0);
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_SQLITEBLOB_6acbdf0084499c6d = function(arg0) {
        const ret = arg0.SQLITE_BLOB;
        return ret;
    };
    imports.wbg.__wbg_SQLITECONSTRAINTCHECK_078c7421516c6cb0 = function(arg0) {
        const ret = arg0.SQLITE_CONSTRAINT_CHECK;
        return ret;
    };
    imports.wbg.__wbg_SQLITECONSTRAINTFOREIGNKEY_542d05e3ee2cb739 = function(arg0) {
        const ret = arg0.SQLITE_CONSTRAINT_FOREIGNKEY;
        return ret;
    };
    imports.wbg.__wbg_SQLITECONSTRAINTNOTNULL_2e70f645b6727cc2 = function(arg0) {
        const ret = arg0.SQLITE_CONSTRAINT_NOTNULL;
        return ret;
    };
    imports.wbg.__wbg_SQLITECONSTRAINTPRIMARYKEY_672b0b877eaa70c2 = function(arg0) {
        const ret = arg0.SQLITE_CONSTRAINT_PRIMARYKEY;
        return ret;
    };
    imports.wbg.__wbg_SQLITECONSTRAINTUNIQUE_99e8e64a3ddb260e = function(arg0) {
        const ret = arg0.SQLITE_CONSTRAINT_UNIQUE;
        return ret;
    };
    imports.wbg.__wbg_SQLITEDONE_71e1fe762c2f590a = function(arg0) {
        const ret = arg0.SQLITE_DONE;
        return ret;
    };
    imports.wbg.__wbg_SQLITEFLOAT_0d1b783b6273c5ca = function(arg0) {
        const ret = arg0.SQLITE_FLOAT;
        return ret;
    };
    imports.wbg.__wbg_SQLITEINTEGER_89d30a97ec5964fa = function(arg0) {
        const ret = arg0.SQLITE_INTEGER;
        return ret;
    };
    imports.wbg.__wbg_SQLITENULL_14a0b14e9418f512 = function(arg0) {
        const ret = arg0.SQLITE_NULL;
        return ret;
    };
    imports.wbg.__wbg_SQLITEOK_a0a5a44f4b54bda1 = function(arg0) {
        const ret = arg0.SQLITE_OK;
        return ret;
    };
    imports.wbg.__wbg_SQLITEOPENCREATE_a89e637416473d65 = function(arg0) {
        const ret = arg0.SQLITE_OPEN_CREATE;
        return ret;
    };
    imports.wbg.__wbg_SQLITEOPENREADWRITE_3eb06e2be4a7f535 = function(arg0) {
        const ret = arg0.SQLITE_OPEN_READWRITE;
        return ret;
    };
    imports.wbg.__wbg_SQLITEOPENURI_73f78cdcb3e54f88 = function(arg0) {
        const ret = arg0.SQLITE_OPEN_URI;
        return ret;
    };
    imports.wbg.__wbg_SQLITEPREPAREPERSISTENT_6f142d8bf27893d7 = function(arg0) {
        const ret = arg0.SQLITE_PREPARE_PERSISTENT;
        return ret;
    };
    imports.wbg.__wbg_SQLITEROW_16ddd22277b912f1 = function(arg0) {
        const ret = arg0.SQLITE_ROW;
        return ret;
    };
    imports.wbg.__wbg_SQLITESTATIC_f6e96ea3ff678329 = function(arg0) {
        const ret = arg0.SQLITE_STATIC;
        return ret;
    };
    imports.wbg.__wbg_SQLITETEXT_4dd38105410a0c0a = function(arg0) {
        const ret = arg0.SQLITE_TEXT;
        return ret;
    };
    imports.wbg.__wbg_allocCString_69f9010fb2b096f0 = function(arg0, arg1, arg2) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg1;
            deferred0_1 = arg2;
            const ret = arg0.allocCString(getStringFromWasm0(arg1, arg2));
            return ret;
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_allocPtr_c83ee345784d444f = function(arg0, arg1, arg2) {
        const ret = arg0.allocPtr(arg1 >>> 0, arg2 !== 0);
        return ret;
    };
    imports.wbg.__wbg_alloc_59459fd5c596f36c = function(arg0, arg1) {
        const ret = arg0.alloc(arg1 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_alloc_818f07788ede8415 = function(arg0, arg1) {
        const ret = arg0.alloc(arg1 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_alloc_9ba78eb5db297dec = function(arg0) {
        const ret = arg0.alloc;
        return ret;
    };
    imports.wbg.__wbg_bindblob_2d3842f5d0645344 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        const ret = arg0.bind_blob(arg1, arg2, arg3 >>> 0, arg4, arg5);
        return ret;
    };
    imports.wbg.__wbg_binddouble_652de2eaf823b755 = function(arg0, arg1, arg2, arg3) {
        const ret = arg0.bind_double(arg1, arg2, arg3);
        return ret;
    };
    imports.wbg.__wbg_bindint64_ab19debe2f3b2a51 = function(arg0, arg1, arg2, arg3) {
        const ret = arg0.bind_int64(arg1, arg2, arg3);
        return ret;
    };
    imports.wbg.__wbg_bindint_d6ed3d7de087f452 = function(arg0, arg1, arg2, arg3) {
        const ret = arg0.bind_int(arg1, arg2, arg3);
        return ret;
    };
    imports.wbg.__wbg_bindnull_db900eeb1a7f0781 = function(arg0, arg1, arg2) {
        const ret = arg0.bind_null(arg1, arg2);
        return ret;
    };
    imports.wbg.__wbg_bindtext_d7063f12780d715d = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        const ret = arg0.bind_text(arg1, arg2, arg3 >>> 0, arg4, arg5);
        return ret;
    };
    imports.wbg.__wbg_buffer_61b7ce01341d7f88 = function(arg0) {
        const ret = arg0.buffer;
        return ret;
    };
    imports.wbg.__wbg_call_500db948e69c7330 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.call(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_call_b0d8e36992d9900d = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.call(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_capi_b2cd9cd3325d1164 = function(arg0) {
        const ret = arg0.capi;
        return ret;
    };
    imports.wbg.__wbg_changes_8f2cadd92748538c = function(arg0, arg1) {
        const ret = arg0.changes(arg1);
        return ret;
    };
    imports.wbg.__wbg_checked_fc3b0aba823c9a35 = function(arg0) {
        const ret = arg0.checked;
        return ret;
    };
    imports.wbg.__wbg_close_061ae3ddcd90d5b9 = function(arg0, arg1) {
        const ret = arg0.close(arg1);
        return ret;
    };
    imports.wbg.__wbg_columncount_328a9b2639ca5c51 = function(arg0, arg1) {
        const ret = arg0.column_count(arg1);
        return ret;
    };
    imports.wbg.__wbg_columnname_5421a5f0dfa3eff5 = function(arg0, arg1, arg2, arg3) {
        const ret = arg1.column_name(arg2, arg3);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_columnvalue_88aa9511cf9c6770 = function(arg0, arg1, arg2) {
        const ret = arg0.column_value(arg1, arg2);
        return ret;
    };
    imports.wbg.__wbg_data_4ce8a82394d8b110 = function(arg0) {
        const ret = arg0.data;
        return ret;
    };
    imports.wbg.__wbg_dbhandle_4a844bc7b495c9bd = function(arg0, arg1) {
        const ret = arg0.db_handle(arg1);
        return ret;
    };
    imports.wbg.__wbg_dealloc_83aa46cc9ca6df71 = function(arg0, arg1) {
        arg0.dealloc(arg1 >>> 0);
    };
    imports.wbg.__wbg_document_f11bc4f7c03e1745 = function(arg0) {
        const ret = arg0.document;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_done_f22c1561fa919baa = function(arg0) {
        const ret = arg0.done;
        return ret;
    };
    imports.wbg.__wbg_errmsg_79ea90bf7680bb35 = function(arg0, arg1, arg2) {
        const ret = arg1.errmsg(arg2);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_error_7534b8e9a36f1ab4 = function(arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_errstr_503ebc5fc9ad1b72 = function(arg0, arg1, arg2) {
        const ret = arg1.errstr(arg2);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_exec_fd553de4a4a4f848 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.exec(arg1, getStringFromWasm0(arg2, arg3));
    }, arguments) };
    imports.wbg.__wbg_extendederrcode_0835da64030ca814 = function(arg0, arg1) {
        const ret = arg0.extended_errcode(arg1);
        return ret;
    };
    imports.wbg.__wbg_filename_0235553cd4665109 = function(arg0, arg1, arg2, arg3, arg4) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg3;
            deferred0_1 = arg4;
            const ret = arg1.filename(arg2, getStringFromWasm0(arg3, arg4));
            const ptr2 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len2 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len2, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr2, true);
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_finalize_429654d82c434d47 = function() { return handleError(function (arg0, arg1) {
        arg0.finalize(arg1);
    }, arguments) };
    imports.wbg.__wbg_getElementById_dcc9f1f3cfdca0bc = function(arg0, arg1, arg2) {
        const ret = arg0.getElementById(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_get_9aa3dff3f0266054 = function(arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return ret;
    };
    imports.wbg.__wbg_get_bbccf8970793c087 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.get(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getwithrefkey_1dc361bd10053bfe = function(arg0, arg1) {
        const ret = arg0[arg1];
        return ret;
    };
    imports.wbg.__wbg_heap8u_253de697ab096b05 = function(arg0) {
        const ret = arg0.heap8u();
        return ret;
    };
    imports.wbg.__wbg_impl_0cd08b475fc5f858 = function(arg0, arg1) {
        const ret = arg0.impl(arg1 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_initmodule_694b4b8a6236ad25 = function(arg0) {
        const ret = SQLite.init_module(arg0);
        return ret;
    };
    imports.wbg.__wbg_instanceof_ArrayBuffer_670ddde44cdb2602 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof ArrayBuffer;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_HtmlElement_d94ed69c6883a691 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_HtmlInputElement_47b3e827f364773c = function(arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLInputElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_HtmlTextAreaElement_88347fc269bfb466 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLTextAreaElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Uint8Array_28af5bc19d6acad8 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Uint8Array;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Window_d2514c6a7ee7ba60 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Window;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_isArray_1ba11a930108ec51 = function(arg0) {
        const ret = Array.isArray(arg0);
        return ret;
    };
    imports.wbg.__wbg_isSafeInteger_12f5549b2fca23f4 = function(arg0) {
        const ret = Number.isSafeInteger(arg0);
        return ret;
    };
    imports.wbg.__wbg_iterator_23604bb983791576 = function() {
        const ret = Symbol.iterator;
        return ret;
    };
    imports.wbg.__wbg_length_65d1cd11729ced11 = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_length_d65cf0786bfc5739 = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_log_0cc1b7768397bcfe = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.log(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3), getStringFromWasm0(arg4, arg5), getStringFromWasm0(arg6, arg7));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_log_464d1b2190ca1e04 = function(arg0) {
        console.log(arg0);
    };
    imports.wbg.__wbg_log_5f82480ac7a101b6 = function(arg0, arg1) {
        console.log(arg0, arg1);
    };
    imports.wbg.__wbg_log_cb9e190acc5753fb = function(arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.log(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_mark_7438147ce31e9d4b = function(arg0, arg1) {
        performance.mark(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_measure_fb7825c11612c823 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        let deferred0_0;
        let deferred0_1;
        let deferred1_0;
        let deferred1_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            deferred1_0 = arg2;
            deferred1_1 = arg3;
            performance.measure(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }, arguments) };
    imports.wbg.__wbg_new_254fa9eac11932ae = function() {
        const ret = new Array();
        return ret;
    };
    imports.wbg.__wbg_new_3c34f3fe365c1436 = function(arg0) {
        const ret = new SQLite(arg0);
        return ret;
    };
    imports.wbg.__wbg_new_3d446df9155128ef = function(arg0, arg1) {
        try {
            var state0 = {a: arg0, b: arg1};
            var cb0 = (arg0, arg1) => {
                const a = state0.a;
                state0.a = 0;
                try {
                    return __wbg_adapter_280(a, state0.b, arg0, arg1);
                } finally {
                    state0.a = a;
                }
            };
            const ret = new Promise(cb0);
            return ret;
        } finally {
            state0.a = state0.b = 0;
        }
    };
    imports.wbg.__wbg_new_3ff5b33b1ce712df = function(arg0) {
        const ret = new Uint8Array(arg0);
        return ret;
    };
    imports.wbg.__wbg_new_688846f374351c92 = function() {
        const ret = new Object();
        return ret;
    };
    imports.wbg.__wbg_new_8a6f238a6ece86ea = function() {
        const ret = new Error();
        return ret;
    };
    imports.wbg.__wbg_new_e04dcd3aad5daca2 = function() { return handleError(function (arg0) {
        const ret = new WebAssembly.Memory(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_newnoargs_fd9e4bf8be2bc16d = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_ba35896968751d91 = function(arg0, arg1, arg2) {
        const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithoptions_338c6ca5006e787c = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = new Worker(getStringFromWasm0(arg0, arg1), arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_next_01dd9234a5bf6d05 = function() { return handleError(function (arg0) {
        const ret = arg0.next();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_next_137428deb98342b0 = function(arg0) {
        const ret = arg0.next;
        return ret;
    };
    imports.wbg.__wbg_open_aba34ed1b3b52dc4 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = arg0.open(getStringFromWasm0(arg1, arg2), arg3 === 0x100000001 ? undefined : arg3);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_peekPtr_6a7d4078b4e26f07 = function(arg0, arg1) {
        const ret = arg0.peekPtr(arg1);
        return ret;
    };
    imports.wbg.__wbg_pointer_310208402223b1bb = function(arg0) {
        const ret = arg0.pointer;
        return ret;
    };
    imports.wbg.__wbg_postMessage_6fd166b24db78adf = function() { return handleError(function (arg0, arg1) {
        arg0.postMessage(arg1);
    }, arguments) };
    imports.wbg.__wbg_preparev3_9322dce970cabecf = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        const ret = arg0.prepare_v3(arg1, arg2 >>> 0, arg3, arg4 >>> 0, arg5, arg6);
        return ret;
    };
    imports.wbg.__wbg_pstack_66a1730e634b3fee = function(arg0) {
        const ret = arg0.pstack;
        return ret;
    };
    imports.wbg.__wbg_queueMicrotask_2181040e064c0dc8 = function(arg0) {
        queueMicrotask(arg0);
    };
    imports.wbg.__wbg_queueMicrotask_ef9ac43769cbcc4f = function(arg0) {
        const ret = arg0.queueMicrotask;
        return ret;
    };
    imports.wbg.__wbg_registerdieselsqlfunctions_f374322dbb736b21 = function() { return handleError(function (arg0, arg1) {
        arg0.register_diesel_sql_functions(arg1);
    }, arguments) };
    imports.wbg.__wbg_reset_a6165093a081b112 = function(arg0, arg1) {
        const ret = arg0.reset(arg1);
        return ret;
    };
    imports.wbg.__wbg_resolve_0bf7c44d641804f9 = function(arg0) {
        const ret = Promise.resolve(arg0);
        return ret;
    };
    imports.wbg.__wbg_restore_43c154983844b05b = function(arg0, arg1) {
        arg0.restore(arg1);
    };
    imports.wbg.__wbg_set_1d80752d0d5f0b21 = function(arg0, arg1, arg2) {
        arg0[arg1 >>> 0] = arg2;
    };
    imports.wbg.__wbg_set_23d69db4e5c66a6e = function(arg0, arg1, arg2) {
        arg0.set(arg1, arg2 >>> 0);
    };
    imports.wbg.__wbg_set_3f1d0b984ed272ed = function(arg0, arg1, arg2) {
        arg0[arg1] = arg2;
    };
    imports.wbg.__wbg_setinnerHTML_2d75307ba8832258 = function(arg0, arg1, arg2) {
        arg0.innerHTML = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setinnerText_a9690b82c4cb9063 = function(arg0, arg1, arg2) {
        arg0.innerText = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setonclick_096859d6b1b46a82 = function(arg0, arg1) {
        arg0.onclick = arg1;
    };
    imports.wbg.__wbg_setonmessage_4596c1308611382a = function(arg0, arg1) {
        arg0.onmessage = arg1;
    };
    imports.wbg.__wbg_settype_42fb5763bc9d9856 = function(arg0, arg1) {
        arg0.type = __wbindgen_enum_WorkerType[arg1];
    };
    imports.wbg.__wbg_sqlite3_0c56434abd1dc461 = function(arg0) {
        const ret = arg0.sqlite3;
        return ret;
    };
    imports.wbg.__wbg_stack_0ed75d68575b0f3c = function(arg0, arg1) {
        const ret = arg1.stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_static_accessor_GLOBAL_0be7472e492ad3e3 = function() {
        const ret = typeof global === 'undefined' ? null : global;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_GLOBAL_THIS_1a6eb482d12c9bfb = function() {
        const ret = typeof globalThis === 'undefined' ? null : globalThis;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_SELF_1dc398a895c82351 = function() {
        const ret = typeof self === 'undefined' ? null : self;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_WINDOW_ae1c80c7eea8d64a = function() {
        const ret = typeof window === 'undefined' ? null : window;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_step_99a553e5d7fbed2f = function(arg0, arg1) {
        const ret = arg0.step(arg1);
        return ret;
    };
    imports.wbg.__wbg_then_0438fad860fe38e1 = function(arg0, arg1) {
        const ret = arg0.then(arg1);
        return ret;
    };
    imports.wbg.__wbg_then_0ffafeddf0e182a4 = function(arg0, arg1, arg2) {
        const ret = arg0.then(arg1, arg2);
        return ret;
    };
    imports.wbg.__wbg_value_47fde8ea2d9fdcd5 = function(arg0, arg1) {
        const ret = arg1.value;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_value_4c32fd138a88eee2 = function(arg0) {
        const ret = arg0.value;
        return ret;
    };
    imports.wbg.__wbg_value_a8b8b65bc31190d6 = function(arg0, arg1) {
        const ret = arg1.value;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_valuedup_6d367159408d8196 = function(arg0, arg1) {
        const ret = arg0.value_dup(arg1 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_valuefree_3f7442e9bb21e645 = function(arg0, arg1) {
        arg0.value_free(arg1 >>> 0);
    };
    imports.wbg.__wbg_valueint_4d711af866e97d8e = function(arg0, arg1) {
        const ret = arg0.value_int(arg1 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_valuetext_1305a3b91ca00e84 = function(arg0, arg1, arg2) {
        const ret = arg1.value_text(arg2 >>> 0);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_valuetype_486feb6594cb75e3 = function(arg0, arg1) {
        const ret = arg0.value_type(arg1 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_version_683c1e99c4c0439b = function(arg0) {
        const ret = arg0.version();
        return ret;
    };
    imports.wbg.__wbg_wasm_a5f31e71db23f94b = function(arg0) {
        const ret = arg0.wasm;
        return ret;
    };
    imports.wbg.__wbindgen_as_number = function(arg0) {
        const ret = +arg0;
        return ret;
    };
    imports.wbg.__wbindgen_boolean_get = function(arg0) {
        const v = arg0;
        const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
        return ret;
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = arg0.original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper2076 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 818, __wbg_adapter_48);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper317 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 130, __wbg_adapter_42);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper318 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 130, __wbg_adapter_45);
        return ret;
    };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbindgen_in = function(arg0, arg1) {
        const ret = arg0 in arg1;
        return ret;
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_export_3;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
        ;
    };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        const ret = typeof(arg0) === 'function';
        return ret;
    };
    imports.wbg.__wbindgen_is_null = function(arg0) {
        const ret = arg0 === null;
        return ret;
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = arg0;
        const ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = arg0 === undefined;
        return ret;
    };
    imports.wbg.__wbindgen_jsval_loose_eq = function(arg0, arg1) {
        const ret = arg0 == arg1;
        return ret;
    };
    imports.wbg.__wbindgen_link_8173fc270f470aee = function(arg0) {
        const ret = new URL('snippets/example-sqlite-web-44384a6b9b8b3f8f/src/worker.js', import.meta.url).toString();
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_link_de369e9aa1a11bdd = function(arg0) {
        const ret = new URL('snippets/sqlite-web-90f8afa7b0cd2303/src/js/sqlite3-opfs-async-proxy.js', import.meta.url).toString();
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return ret;
    };
    imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'number' ? obj : undefined;
        getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        const ret = arg0;
        return ret;
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function __wbg_init_memory(imports, memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('example_sqlite_web_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
