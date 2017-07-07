var LocalStorage = typeof window !== "undefined" && window.localStorage
    , prefixes = {}
    , store

if (LocalStorage) {
    try {
        var x = '__testStorage__'
        LocalStorage.setItem(x, x)
        LocalStorage.removeItem(x)
        store = createLocalStore
    } catch (e) {
        store = createMemoryStore
    }
} else {
    store = createMemoryStore
}

store.createMemoryStore = createMemoryStore
store.createLocalStore = createLocalStore

module.exports = store

function createLocalStore(prefix) {
    prefix = prefix || ""

    return {
        set: storeSet
        , get: storeGet
        , delete: storeDelete
    }

    function storeSet(key, value) {
        LocalStorage.setItem(prefix + "." + key, JSON.stringify(value))
    }

    function storeGet(key) {
        var str = LocalStorage.getItem(prefix + "." + key)
        if (str === null) {
            return null
        }
        return JSON.parse(str)
    }

    function storeDelete(key) {
        return LocalStorage.removeItem(prefix + "." + key)
    }
}

function createMemoryStore(prefix) {
    var store = {}
    if (prefix) {
        store = prefixes[prefix]

        if (!store) {
            store = prefixes[prefix] = {}
        }
    }

    return {
        set: storeSet
        , get: storeGet
        , delete: storeDelete
    }

    function storeSet(key, value) {
        store[key] = value
    }

    function storeGet(key) {
        if (!(key in store)) {
            return null
        }

        return store[key]
    }

    function storeDelete(key) {
        return delete store[key]
    }
}