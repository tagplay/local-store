var LocalStorage = typeof window !== "undefined" && window.localStorage
    , prefixes = {}

if (LocalStorage) {
    module.exports = createLocalStore()
} else {
    module.exports = createMemoryStore()
}

function createLocalStore(prefix) {
    prefix = prefix || ""

    return {
        set: storeSet
        , get: storeGet
        , delete: storeDelete
        , createStore: createLocalStore
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
        , createStore: createMemoryStore
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