/* ============================================
   儲值滿額贈計算工具 - 核心邏輯 v3 (Refactored)
   ============================================ */

const GAME_VIP_DATA = {
    game_a: {
        label: '大滿貫（紅鑽）',
        currencyNote: '道具單位：紅鑽',
        platforms: {
            win_apk: {
                label: 'WIN / APK',
                vip: {
                    0: [30, 60, 150, 300, 450, 900, 1500, 3000],
                    1: [30, 60, 150, 300, 450, 900, 1500, 3000],
                    2: [60, 150, 300, 450, 900, 1500, 3000, 5000],
                    3: [60, 150, 300, 450, 900, 1500, 3000, 5000],
                    4: [150, 300, 450, 900, 1500, 3000, 5000, 10000, 20000, 30000],
                    5: [150, 300, 450, 900, 1500, 3000, 5000, 10000, 20000, 30000],
                    6: [150, 300, 450, 900, 1500, 3000, 5000, 10000, 20000, 30000],
                },
            },
            android: {
                label: '安卓',
                vip: {
                    0: [30, 60, 150, 300, 450, 900, 1500, 3000],
                    1: [30, 60, 150, 300, 450, 900, 1500, 3000],
                    2: [60, 150, 300, 450, 900, 1500, 3000, 5000],
                    3: [60, 150, 300, 450, 900, 1500, 3000, 5000],
                    4: [150, 300, 450, 900, 1500, 3000, 5000, 10000, 20000, 30000],
                    5: [150, 300, 450, 900, 1500, 3000, 5000, 10000, 20000, 30000],
                    6: [150, 300, 450, 900, 1500, 3000, 5000, 10000, 20000, 30000],
                },
            },
            ios: {
                label: 'iOS',
                vip: {
                    0: [33, 70, 170, 330, 490, 990, 1690, 3290],
                    1: [33, 70, 170, 330, 490, 990, 1690, 3290],
                    2: [70, 170, 330, 490, 990, 1690, 3290, 5490],
                    3: [70, 170, 330, 490, 990, 1690, 3290, 5490],
                    4: [170, 330, 490, 990, 1690, 3290, 5490, 10000, 20000, 30000],
                    5: [170, 330, 490, 990, 1690, 3290, 5490, 10000, 20000, 30000],
                    6: [170, 330, 490, 990, 1690, 3290, 5490, 10000, 20000, 30000],
                },
            },
            ios_white: {
                label: 'iOS白',
                vip: {
                    0: [33, 70, 170, 330, 490, 990, 1690, 3290],
                    1: [33, 70, 170, 330, 490, 990, 1690, 3290],
                    2: [70, 170, 330, 490, 990, 1690, 3290, 5490],
                    3: [70, 170, 330, 490, 990, 1690, 3290, 5490],
                    4: [170, 330, 490, 990, 1690, 3290, 5490, 10000, 20000, 30000],
                    5: [170, 330, 490, 990, 1690, 3290, 5490, 10000, 20000, 30000],
                    6: [170, 330, 490, 990, 1690, 3290, 5490, 10000, 20000, 30000],
                },
            },
        },
    },
    mahjong2: {
        label: '競技麻將2（鑽石/金幣）',
        currencyNote: '儲值後獲得對應品項',
        noVip: true,
        noPlatformDiff: true,
        depositItemMeta: [
            { amount: 70, coins: 70000000, diamonds: 70 },
            { amount: 170, coins: 170000000, diamonds: 170 },
            { amount: 330, coins: 330000000, diamonds: 330 },
            { amount: 490, coins: 490000000, diamonds: 490 },
            { amount: 670, coins: 670000000, diamonds: 670 },
            { amount: 990, coins: 990000000, diamonds: 990 },
            { amount: 1690, coins: 1690000000, diamonds: 1690 },
            { amount: 2490, coins: 2490000000, diamonds: 2490 },
            { amount: 3290, coins: 3290000000, diamonds: 3290 },
        ],
        platforms: {
            win_apk: { label: 'WIN / APK', vip: _mahjong2Vip() },
            android: { label: '安卓', vip: _mahjong2Vip() },
            ios: { label: 'iOS', vip: _mahjong2Vip() },
            ios_white: { label: 'iOS白', vip: _mahjong2Vip() },
        },
    },
    star_3_in_1: {
        label: '明星三缺一（紅利點數）',
        currencyNote: '紅利點數已於遊戲內獲得',
        noVip: true,
        noPlatformDiff: true,
        depositItemMeta: [], // 儲值品項待提供
        platforms: {
            win_apk: { label: 'WIN / APK', vip: { 0: [] } },
            android: { label: '安卓', vip: { 0: [] } },
            ios: { label: 'iOS', vip: { 0: [] } },
            ios_white: { label: 'iOS白', vip: { 0: [] } },
        },
    },
};

function _mahjong2Vip() {
    const amounts = [70, 170, 330, 490, 670, 990, 1690, 2490, 3290];
    const vipObj = {};
    for (let i = 0; i <= 6; i++) vipObj[i] = amounts;
    return vipObj;
}

const STORAGE_KEY = 'deposit_calculator_data_v3';

// ===== 1. State Management =====
let appState = {
    activities: [],
    currentActivityId: null,
    sessions: {},
};

let currentPage = 1;
const PAGE_SIZE = 20;

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
}

function createDefaultActivity(name, game) {
    return {
        id: generateId(),
        name: name,
        game: game || 'game_a',
        threshold: 1000,
        enableGlobalBonus: false,
        globalBonusMin: 0,
        globalBonusMax: 10,
        globalBonusStep: 1,
        enableChannelBonus: false,
        channelBonusRate: 5,
    };
}

function createDefaultSession() {
    return {
        initialAssets: 0,
        initialItems: 0,
        vipLevel: 0,
        platform: 'win_apk',
        depositType: 'diamonds',
        records: [],
    };
}

function getCurrentActivity() {
    return appState.activities.find(a => a.id === appState.currentActivityId) || null;
}

function getCurrentSession() {
    if (!appState.currentActivityId) return null;
    if (!appState.sessions[appState.currentActivityId]) {
        appState.sessions[appState.currentActivityId] = createDefaultSession();
    }
    return appState.sessions[appState.currentActivityId];
}

// ===== 2. Storage =====
function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (e) { console.warn('Failed to save state:', e); }
}

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            appState = JSON.parse(raw);
        }
    } catch (e) { console.warn('Failed to load state:', e); }
}

// ===== 3. Logic & Calculations =====
function computeRecords(session, threshold) {
    let cumulativeDeposit = 0;
    let currentAssets = session.initialAssets;
    let totalBonusItems = 0;
    const computed = [];

    for (let i = 0; i < session.records.length; i++) {
        const rec = session.records[i];
        const prevCumulative = cumulativeDeposit;
        cumulativeDeposit += rec.depositAmount;
        currentAssets += rec.depositAmount + rec.bonusAssets;
        totalBonusItems += rec.bonusItems;

        const prevMilestone = threshold > 0 ? Math.floor(prevCumulative / threshold) : 0;
        const currMilestone = threshold > 0 ? Math.floor(cumulativeDeposit / threshold) : 0;
        const newMilestoneItems = currMilestone - prevMilestone;

        computed.push({
            index: i + 1,
            depositAmount: rec.depositAmount,
            bonusAssets: rec.bonusAssets,
            bonusItems: rec.bonusItems,
            assetsAfter: currentAssets,
            cumulativeDeposit: cumulativeDeposit,
            newMilestoneItems: newMilestoneItems,
            totalMilestoneItems: currMilestone,
            totalItems: session.initialItems + currMilestone + totalBonusItems,
        });
    }

    const totalMilestoneItems = threshold > 0 ? Math.floor(cumulativeDeposit / threshold) : 0;
    const nextMilestoneAt = threshold > 0 ? (totalMilestoneItems + 1) * threshold : 0;
    const nextMilestoneDiff = threshold > 0 ? nextMilestoneAt - cumulativeDeposit : 0;

    return {
        computed,
        currentAssets,
        cumulativeDeposit,
        totalMilestoneItems,
        totalItems: session.initialItems + totalMilestoneItems + totalBonusItems,
        nextMilestoneDiff,
    };
}

function formatNumber(n) {
    return Number(n).toLocaleString('zh-TW');
}

// ===== 4. UI References =====
const $ = (id) => document.getElementById(id);
const els = {
    activitySelectWrapper: $('activity-select-wrapper'),
    activitySelectDisplay: $('activity-select-display'),
    activitySelectText: $('activity-select-text'),
    activitySelectDropdown: $('activity-select-dropdown'),

    btnNewActivity: $('btn-new-activity'),
    btnEditActivity: $('btn-edit-activity'),
    btnDeleteActivity: $('btn-delete-activity'),
    noActivityPlaceholder: $('no-activity-placeholder'),
    mainContent: $('main-content'),

    thresholdAmount: $('threshold-amount'),
    initialAssets: $('initial-assets'),
    initialItems: $('initial-items'),
    vipSelect: $('vip-select'),
    platformSelect: $('platform-select'),
    vipLevelRow: $('vip-level-row'),
    platformRow: $('platform-row'),
    depositTypeRow: $('deposit-type-row'),
    depositTypeSelect: $('deposit-type-select'),

    enableGlobalBonus: $('enable-global-bonus'),
    globalBonusCard: $('global-bonus-card'),
    globalBonusSettings: $('global-bonus-settings'),
    globalBonusMin: $('global-bonus-min'),
    globalBonusMax: $('global-bonus-max'),
    globalBonusStep: $('global-bonus-step'),

    enableChannelBonus: $('enable-channel-bonus'),
    channelBonusCard: $('channel-bonus-card'),
    channelBonusSettings: $('channel-bonus-settings'),
    channelBonusRate: $('channel-bonus-rate'),

    depositButtons: $('deposit-buttons'),
    currencyNote: $('currency-note'),
    customAmount: $('custom-amount'),
    btnCustomDeposit: $('btn-custom-deposit'),

    currentAssetsDisplay: $('current-assets-display'),
    cumulativeDepositDisplay: $('cumulative-deposit-display'),
    nextMilestoneDisplay: $('next-milestone-display'),
    milestoneItemsDisplay: $('milestone-items-display'),
    totalItemsDisplay: $('total-items-display'),

    recordTbody: $('record-tbody'),
    emptyRecords: $('empty-records'),
    tableWrapper: $('table-wrapper'),
    selectAllRecords: $('select-all-records'),
    btnDeleteSelected: $('btn-delete-selected'),
    btnUndo: $('btn-undo'),
    btnClear: $('btn-clear'),

    paginationBar: $('pagination-bar'),
    pageNumbers: $('page-numbers'),
    pageInfo: $('page-info'),
    btnPageFirst: $('btn-page-first'),
    btnPagePrev: $('btn-page-prev'),
    btnPageNext: $('btn-page-next'),
    btnPageLast: $('btn-page-last'),

    activityModal: $('activity-modal'),
    activityNameInput: $('activity-name-input'),
    activityGameInput: $('activity-game-input'),
    activityModalSave: $('activity-modal-save'),
    activityModalCancel: $('activity-modal-cancel'),
    activityModalClose: $('activity-modal-close'),

    verificationModal: $('verification-modal'),
    verifyBaseAmount: $('verify-base-amount'),
    verifyOptionList: $('verify-option-list'),
    verificationModalCancel: $('verification-modal-cancel'),
    verificationModalClose: $('verification-modal-close'),

    confirmModal: $('confirm-modal'),
    confirmMessage: $('confirm-message'),
    confirmYes: $('confirm-yes'),
    confirmNo: $('confirm-no'),
};

// ===== 5. UI Rendering =====
function renderMainVisibility() {
    const hasActivity = !!getCurrentActivity();
    els.noActivityPlaceholder.style.display = hasActivity ? 'none' : 'block';
    els.mainContent.style.display = hasActivity ? 'grid' : 'none';
}

function renderSettings() {
    const activity = getCurrentActivity();
    const session = getCurrentSession();
    if (!activity || !session) return;

    els.thresholdAmount.value = activity.threshold;
    els.initialAssets.value = session.initialAssets;
    els.initialItems.value = session.initialItems;
    els.vipSelect.value = session.vipLevel;
    els.platformSelect.value = session.platform;
    els.depositTypeSelect.value = session.depositType;

    els.enableGlobalBonus.checked = activity.enableGlobalBonus;
    els.globalBonusSettings.style.display = activity.enableGlobalBonus ? 'flex' : 'none';
    els.globalBonusMin.value = activity.globalBonusMin;
    els.globalBonusMax.value = activity.globalBonusMax;
    els.globalBonusStep.value = activity.globalBonusStep;

    els.enableChannelBonus.checked = activity.enableChannelBonus || false;
    els.channelBonusSettings.style.display = activity.enableChannelBonus ? 'flex' : 'none';
    els.channelBonusRate.value = activity.channelBonusRate !== undefined ? activity.channelBonusRate : 5;

    const isMahjong2 = activity.game === 'mahjong2';
    const isStar3in1 = activity.game === 'star_3_in_1';
    els.vipLevelRow.style.display = (isMahjong2 || isStar3in1) ? 'none' : 'flex';
    els.platformRow.style.display = (isMahjong2 || isStar3in1) ? 'none' : 'flex';
    els.depositTypeRow.style.display = isMahjong2 ? 'flex' : 'none';
    els.channelBonusCard.style.display = isStar3in1 ? 'block' : 'none';
    els.globalBonusCard.style.display = isStar3in1 ? 'block' : 'none';
}

function renderDepositButtons() {
    const activity = getCurrentActivity();
    const session = getCurrentSession();
    if (!activity || !session) return;

    const gameInfo = GAME_VIP_DATA[activity.game];
    const platform = session.platform;
    const vip = session.vipLevel;
    const amounts = gameInfo?.platforms?.[platform]?.vip?.[vip] || [];

    els.currencyNote.textContent = gameInfo?.currencyNote || '';
    els.depositButtons.innerHTML = '';

    if (amounts.length === 0) {
        els.depositButtons.innerHTML = '<div class="empty-state" style="grid-column: 1/-1; padding: 2rem; color: var(--text-muted);">🚩 儲值品項待提供，可使用下方的客製化儲值進行計算</div>';
        return;
    }

    amounts.forEach(amount => {
        const btn = document.createElement('button');
        btn.className = 'deposit-btn';

        if (activity.game === 'mahjong2') {
            const meta = gameInfo.depositItemMeta.find(m => m.amount === amount);
            const isCoins = session.depositType === 'coins';
            const assetAmount = isCoins ? meta.coins : meta.diamonds;

            btn.innerHTML = `
                <span class="ntd-amount">${amount} NTD</span>
                <span class="asset-amount">${formatNumber(assetAmount)}</span>
            `;
        } else {
            btn.innerHTML = `<span class="amount">${formatNumber(amount)}</span>`;
        }

        btn.addEventListener('click', () => handleDepositTrigger(amount));
        els.depositButtons.appendChild(btn);
    });
}

function renderAll() {
    buildCustomSelectOptions();
    renderMainVisibility();
    if (getCurrentActivity()) {
        renderSettings();
        renderDepositButtons();
        renderStatus();
        renderRecords();
    }
}

function renderStatus() {
    const activity = getCurrentActivity();
    const session = getCurrentSession();
    if (!activity || !session) return;

    const result = computeRecords(session, activity.threshold);
    els.currentAssetsDisplay.textContent = formatNumber(result.currentAssets);
    els.cumulativeDepositDisplay.textContent = formatNumber(result.cumulativeDeposit);
    els.nextMilestoneDisplay.textContent = formatNumber(result.nextMilestoneDiff);
    els.milestoneItemsDisplay.textContent = formatNumber(result.totalMilestoneItems);
    els.totalItemsDisplay.textContent = formatNumber(result.totalItems);
}

function renderRecords() {
    const activity = getCurrentActivity();
    const session = getCurrentSession();
    if (!activity || !session) return;

    const { computed } = computeRecords(session, activity.threshold);
    els.emptyRecords.style.display = computed.length ? 'none' : 'block';
    els.tableWrapper.style.display = computed.length ? 'block' : 'none';
    els.btnUndo.disabled = !computed.length;
    els.btnClear.disabled = !computed.length;

    const totalPages = Math.max(1, Math.ceil(computed.length / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;
    const start = (currentPage - 1) * PAGE_SIZE;
    const slice = computed.slice(start, start + PAGE_SIZE);

    els.recordTbody.innerHTML = '';
    slice.forEach(rec => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="col-check"><input type="checkbox" data-index="${rec.index - 1}"></td>
            <td>${rec.index}</td>
            <td>${formatNumber(rec.depositAmount)}</td>
            <td>${rec.bonusAssets > 0 ? '+' + formatNumber(rec.bonusAssets) : '-'}</td>
            <td>${rec.bonusItems > 0 ? '+' + formatNumber(rec.bonusItems) : '-'}</td>
            <td>${formatNumber(rec.assetsAfter)}</td>
            <td>${formatNumber(rec.cumulativeDeposit)}</td>
            <td class="${rec.newMilestoneItems > 0 ? 'milestone-new' : ''}">${rec.newMilestoneItems > 0 ? '+' + rec.newMilestoneItems : '-'}</td>
            <td>${formatNumber(rec.totalMilestoneItems)}</td>
            <td class="col-total">${formatNumber(rec.totalItems)}</td>
        `;
        els.recordTbody.appendChild(tr);
    });

    els.paginationBar.style.display = totalPages > 1 ? 'flex' : 'none';
    els.pageInfo.textContent = `第 ${currentPage} / ${totalPages} 頁 (共 ${computed.length} 筆)`;
}

// ===== 6. Deposit Handling =====
function handleDepositTrigger(amount) {
    const activity = getCurrentActivity();
    if (activity.enableGlobalBonus) {
        openVerificationModal(amount);
    } else {
        const bonusAssets = (activity.enableChannelBonus && activity.channelBonusRate)
            ? Math.floor(amount * (activity.channelBonusRate / 100))
            : 0;
        addRecord(amount, bonusAssets, 0);
    }
}

function openVerificationModal(amount) {
    const activity = getCurrentActivity();
    els.verifyBaseAmount.textContent = formatNumber(amount);
    els.verifyOptionList.innerHTML = '';

    const baseMin = activity.globalBonusMin;
    const baseMax = activity.globalBonusMax;
    const step = activity.globalBonusStep || 1;
    const channelBonusRate = (activity.enableChannelBonus && activity.channelBonusRate) ? activity.channelBonusRate : 0;

    for (let p = baseMin; p <= baseMax; p += step) {
        const totalP = p + channelBonusRate;
        const bonusAssets = Math.floor(amount * (totalP / 100));
        const btn = document.createElement('div');
        btn.className = 'verify-btn';
        btn.innerHTML = `
            <span class="verify-amount">${formatNumber(amount + bonusAssets)}</span>
            <span class="verify-label">+${totalP}% (${p}%隨機 + ${channelBonusRate}%渠道)</span>
        `;
        btn.onclick = () => {
            addRecord(amount, bonusAssets, 0);
            closeVerificationModal();
        };
        els.verifyOptionList.appendChild(btn);
    }
    els.verificationModal.style.display = 'flex';
}

function closeVerificationModal() { els.verificationModal.style.display = 'none'; }

function addRecord(amount, bonusAssets, bonusItems) {
    const session = getCurrentSession();
    session.records.push({ depositAmount: amount, bonusAssets, bonusItems });
    saveState();
    renderStatus();
    currentPage = Math.ceil(session.records.length / PAGE_SIZE);
    renderRecords();
}

// ===== 7. Custom Activity Select =====
function buildCustomSelectOptions() {
    const dropdown = els.activitySelectDropdown;
    dropdown.innerHTML = '';
    if (appState.activities.length === 0) {
        els.activitySelectText.textContent = '— 請先新增活動 —';
    } else {
        const current = getCurrentActivity();
        els.activitySelectText.textContent = current ? current.name : '— 請選擇活動 —';
        appState.activities.forEach(a => {
            const opt = document.createElement('div');
            opt.className = 'custom-select-option' + (a.id === appState.currentActivityId ? ' selected' : '');
            opt.textContent = a.name;
            opt.onclick = () => {
                appState.currentActivityId = a.id;
                saveState();
                renderAll();
                els.activitySelectDropdown.classList.remove('open');
            };
            dropdown.appendChild(opt);
        });
    }
}

// ===== 8. Event Listeners =====
function initEvents() {
    // Activity Select
    els.activitySelectDisplay.onclick = (e) => {
        e.stopPropagation();
        els.activitySelectDropdown.classList.toggle('open');
    };
    document.onclick = () => els.activitySelectDropdown.classList.remove('open');

    // Modals
    els.btnNewActivity.onclick = () => openActivityModal('new');
    els.btnEditActivity.onclick = () => openActivityModal('edit');
    els.btnDeleteActivity.onclick = () => openConfirmModal('確定刪除此活動及其紀錄嗎？', () => {
        appState.activities = appState.activities.filter(a => a.id !== appState.currentActivityId);
        delete appState.sessions[appState.currentActivityId];
        appState.currentActivityId = appState.activities.length ? appState.activities[0].id : null;
        saveState(); renderAll();
    });

    els.activityModalSave.onclick = () => {
        const name = els.activityNameInput.value.trim();
        const game = els.activityGameInput.value;
        if (!name) return;

        let activity = getCurrentActivity();
        if (!activity || els.activityModal.dataset.mode === 'new') {
            activity = createDefaultActivity(name, game);
            appState.activities.push(activity);
            appState.currentActivityId = activity.id;
        } else {
            activity.name = name;
            activity.game = game;
        }
        saveState();
        els.activityModal.style.display = 'none';
        renderAll();
    };
    els.activityModalCancel.onclick = els.activityModalClose.onclick = () => els.activityModal.style.display = 'none';

    // Settings sync
    els.thresholdAmount.onchange = () => { getCurrentActivity().threshold = parseInt(els.thresholdAmount.value) || 0; saveState(); renderStatus(); renderRecords(); };
    els.initialAssets.onchange = () => { getCurrentSession().initialAssets = parseInt(els.initialAssets.value) || 0; saveState(); renderStatus(); renderRecords(); };
    els.initialItems.onchange = () => { getCurrentSession().initialItems = parseInt(els.initialItems.value) || 0; saveState(); renderStatus(); renderRecords(); };
    els.vipSelect.onchange = () => { getCurrentSession().vipLevel = parseInt(els.vipSelect.value); saveState(); renderDepositButtons(); };
    els.platformSelect.onchange = () => { getCurrentSession().platform = els.platformSelect.value; saveState(); renderDepositButtons(); };
    els.depositTypeSelect.onchange = () => { getCurrentSession().depositType = els.depositTypeSelect.value; saveState(); renderDepositButtons(); };

    // Global Bonus settings
    els.enableGlobalBonus.onchange = () => { getCurrentActivity().enableGlobalBonus = els.enableGlobalBonus.checked; saveState(); renderSettings(); };
    els.globalBonusMin.onchange = () => { getCurrentActivity().globalBonusMin = parseFloat(els.globalBonusMin.value) || 0; saveState(); };
    els.globalBonusMax.onchange = () => { getCurrentActivity().globalBonusMax = parseFloat(els.globalBonusMax.value) || 0; saveState(); };
    els.globalBonusStep.onchange = () => { getCurrentActivity().globalBonusStep = parseFloat(els.globalBonusStep.value) || 1; saveState(); };

    // Channel Bonus settings
    els.enableChannelBonus.onchange = () => { getCurrentActivity().enableChannelBonus = els.enableChannelBonus.checked; saveState(); renderSettings(); };
    els.channelBonusRate.onchange = () => { getCurrentActivity().channelBonusRate = parseFloat(els.channelBonusRate.value) || 0; saveState(); };

    // Deposit
    els.btnCustomDeposit.onclick = () => { const val = parseInt(els.customAmount.value); if (val) { handleDepositTrigger(val); els.customAmount.value = ''; } };
    els.verificationModalCancel.onclick = els.verificationModalClose.onclick = closeVerificationModal;

    // Record actions
    els.btnUndo.onclick = () => { getCurrentSession().records.pop(); saveState(); renderStatus(); renderRecords(); };
    els.btnClear.onclick = () => openConfirmModal('確定清空所有紀錄？', () => { getCurrentSession().records = []; saveState(); renderStatus(); renderRecords(); });

    // Confirm Modal
    els.confirmYes.onclick = () => { els.confirmModal.style.display = 'none'; if (els.confirmModal._callback) els.confirmModal._callback(); };
    els.confirmNo.onclick = () => els.confirmModal.style.display = 'none';
}

function openActivityModal(mode) {
    els.activityModal.dataset.mode = mode;
    const activity = getCurrentActivity();
    els.activityNameInput.value = mode === 'edit' ? activity.name : '';
    els.activityGameInput.value = mode === 'edit' ? activity.game : 'game_a';
    els.activityModal.style.display = 'flex';
}

function openConfirmModal(msg, cb) {
    els.confirmMessage.textContent = msg;
    els.confirmModal._callback = cb;
    els.confirmModal.style.display = 'flex';
}

// ===== 9. Initialization =====
function init() {
    loadState();
    initEvents();
    renderAll();
}

window.onload = init;
