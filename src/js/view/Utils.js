// UI Utils

function $(x) {
    return document.querySelector(x);
}

function $$(x) {
    return document.querySelectorAll(x);
}

function toggle(div, visible) {
    let d = visible;
    if (visible === true) d = 'block';
    if (visible === false) d = 'none';

    div.style.display = d;
}

function toggleFaded(div, isVisible, params) {
    params = params || {};
    if (params.isBack) {
        div.classList.add('isBack');
    } else {
        div.classList.remove('isBack');
    }
    if (isVisible) {
        div.classList.add('faded-show');
        div.classList.remove('faded-hide');
    } else {
        div.classList.remove('faded-show');
        div.classList.add('faded-hide');
    }
}

function triggerClass(div, className, duration) {
    div.classList.add(className);

    setTimeout(() => {
        div.classList.remove(className);
    }, duration);
}

function createElement(params) {
    const item = document.createElement(params.tag);
    if (params.clazz) {
        if (Array.isArray(params.clazz)) {
            for (let c of params.clazz) {
                if (c) {
                    item.classList.add(c);
                }
            }
        } else {
            item.classList.add(params.clazz);
        }
    }
    if (params.text) item.innerText = params.text;
    if (params.child) {
        for (let c of params.child) {
            if (c) {
                item.appendChild(c);
            }
        }
    }
    if (params.style) {
        for (let key in params.style) {
            item.style[key] = params.style[key];
        }
    }
    return item;
}

function setAddr(el, s) {
    el.innerHTML = '';
    el.appendChild(document.createTextNode(s.substring(0, s.length / 2)));
    el.appendChild(document.createElement('wbr'));
    el.appendChild(document.createTextNode(s.substring(s.length / 2)));
    return el;
}

function clearElement(el) {
    el.innerHTML = '';
}

function onInput(input, handler) {
    input.addEventListener('change', handler);
    input.addEventListener('input', handler);
    input.addEventListener('cut', handler);
    input.addEventListener('paste', handler);
}

function doubleZero(n) {
    if (n < 10) return '0' + n;
    return n;
}

function formatTime(date) {
    return doubleZero(date.getHours()) + ':' + doubleZero(date.getMinutes());
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function formatDate(date) {
    return MONTH_NAMES[date.getMonth()] + ' ' + date.getDate();
}

function formatDateFull(date) {
    return date.toString();
}

function copyToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";  //avoid scrolling to bottom
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    var result = false;
    try {
        const successful = document.execCommand('copy');
        result = successful ? 'successful' : 'unsuccessful';
    } catch (err) {
    }

    document.body.removeChild(textArea);
    return result;
}

// ton://transfer/EQA0i8-CdGnF_DhUHHf92R1ONH6sIA9vLZ_WLcCIhfBBXwtG
// ton://transfer/EQA0i8-CdGnF_DhUHHf92R1ONH6sIA9vLZ_WLcCIhfBBXwtG?amount=1000000000
// ton://transfer/EQA0i8-CdGnF_DhUHHf92R1ONH6sIA9vLZ_WLcCIhfBBXwtG?amount=1000000000&text=data
// ton://transfer/EQA0i8-CdGnF_DhUHHf92R1ONH6sIA9vLZ_WLcCIhfBBXwtG?amount=1000000000&text=foo%3A%2F%2Fbar%2C%2Fbaz%3Famount%3D1%26text%3D%D1%80%D1%83
function parseTransferUrl(urlString) {
    if (!urlString.startsWith('ton://')) {
        return undefined;
    }

    let url;

    try {
        url = new URL(urlString.replace(/^ton/, 'https'));
    } catch (error) {
        if (error.code === 'ERR_INVALID_URL') {
            console.warn(error);
            return undefined;
        }

        throw error;
    }

    if (url.host !== 'transfer') {
        return undefined;
    }

    if (!url.pathname) {
        return undefined;
    }

    const [ _, address ] = url.pathname.split('/')

    if (!address) {
        return undefined;
    }

    const result = {
        address,
    };

    const amount = url.searchParams.get('amount');

    if (amount) {
        result.amount = amount;
    }

    const text = url.searchParams.get('text');

    if (text) {
        result.text = text;
    }

    return result;
}

function formatTransferUrl(transfer) {
    const url = new URL('https://transfer');

    url.pathname = url.pathname + transfer.address;

    if (transfer.amount) {
        url.searchParams.set('amount', transfer.amount);
    }

    if (transfer.text) {
        url.searchParams.set('text', transfer.text);
    }

    return String(url).replace(/^https/, 'ton');
}

const IMPORT_WORDS_COUNT = 24;
const CONFIRM_WORDS_COUNT = 3;

export {
    $,
    $$,
    toggle,
    toggleFaded,
    triggerClass,
    createElement,
    clearElement,
    onInput,
    setAddr,
    doubleZero,
    formatTime,
    formatDate,
    formatDateFull,
    copyToClipboard,
    parseTransferUrl,
    formatTransferUrl,
    IMPORT_WORDS_COUNT,
    CONFIRM_WORDS_COUNT
};
