/* ============================================
   儲值滿額贈計算工具 - 核心邏輯 v2
   ============================================ */

// ===== 1. VIP 品項資料定義 =====
// 結構：GAME_VIP_DATA[遊戲][平台][VIP等級] = [金額陣列]
// 若 noVip: true，代表此遊戲不分VIP等級（所有等級品項相同）
// 若 noPlatformDiff: true，代表此遊戲各平台品項相同
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

    // ── 競技麻將2：不分VIP等級，各平台品項相同 ──
    // 儲值金額 → 金幣（x1,000,000）+ 鑽石（x1）
    mahjong2: {
        label: '競技麻將2（金幣/鑽石）',
        currencyNote: '儲值後獲得金幣（×1,000,000）及等量鑽石',
        noVip: true,           // 不分VIP，VIP選單僅供參考
        noPlatformDiff: true,  // 各平台品項相同
        // 每筆儲值金額（幣別不分，統一列出）
        // 金幣獲得量 = 金額 × 1,000,000；鑽石獲得量 = 金額
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
};

// 幫競技麻將2生成 VIP 0~6 全部相同品項
function _mahjong2Vip() {
    const amounts = [70, 170, 330, 490, 670, 990, 1690, 2490, 3290];
    const vipObj = {};
    for (let i = 0; i <= 6; i++) vipObj[i] = amounts;
    return vipObj;
}

// 取得遊戲資訊（label、currencyNote 等）
function getGameInfo(game) {
    return GAME_VIP_DATA[game] || null;
}

// 取得存款品項的 meta（競技麻將2 等有特殊 meta 的遊戲）
function getDepositItemMeta(game, amount) {
    const items = GAME_VIP_DATA[game]?.depositItemMeta;
    if (!items) return null;
    return items.find(m => m.amount === amount) || null;
}

function getAmounts(game, platform, vipLevel) {
    return GAME_VIP_DATA[game]?.platforms?.[platform]?.vip?.[vipLevel] || [];
}

const STORAGE_KEY = 'deposit_calculator_data_v2';

// ===== 2. State Management =====
let appState = {
    activities: [],
    currentActivityId: null,
    sessions: {},
};

// Pagination state (not persisted)
let currentPage = 1;
const PAGE_SIZE = 20;

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
}

function createDefaultActivity(name) {
    return {
        id: generateId(),
        name: name,
        threshold: 1000,
        bonusConfig: {},
    };
}

function createDefaultSession() {
    return {
        initialAssets: 0,
        initialItems: 0,
        game: 'game_a',
        vipLevel: 0,
        platform: 'win_apk',
        depositType: 'coins', // 競技麻將2 專用：金幣/鑽石
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
    const session = appState.sessions[appState.currentActivityId];
    // Ensure all fields exist for legacy data
    if (!session.game) session.game = 'game_a';
    if (!session.depositType) session.depositType = 'coins';
    return session;
}

// ===== 3. Storage (localStorage) =====
function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (e) {
        console.warn('Failed to save state:', e);
    }
}

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            appState = {
                activities: parsed.activities || [],
                currentActivityId: parsed.currentActivityId || null,
                sessions: parsed.sessions || {},
            };
        }
    } catch (e) {
        console.warn('Failed to load state:', e);
    }
}

// ===== 4. Calculation Functions =====
function getBonusConfigKey(platform, amount) {
    return `${platform}_${amount}`;
}

function getBonusConfig(activity, platform, amount) {
    const key = getBonusConfigKey(platform, amount);
    return activity.bonusConfig[key] || {
        assetBonusType: 'none',
        assetBonusValue: 0,
        itemBonusType: 'none',
        itemBonusFixed: 0,
        itemBonusMin: 0,
        itemBonusMax: 0,
    };
}

function calculateBonusAssets(depositAmount, bonusConfig) {
    switch (bonusConfig.assetBonusType) {
        case 'ratio':
            return Math.floor(depositAmount * (bonusConfig.assetBonusValue / 100));
        case 'fixed':
            return bonusConfig.assetBonusValue || 0;
        default:
            return 0;
    }
}

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

// ===== 5. UI References =====
const $ = (id) => document.getElementById(id);

const els = {
    // Activity custom select
    activitySelectWrapper: $('activity-select-wrapper'),
    activitySelectDisplay: $('activity-select-display'),
    activitySelectText: $('activity-select-text'),
    activitySelectDropdown: $('activity-select-dropdown'),
    activitySelect: $('activity-select'), // hidden real select

    btnNewActivity: $('btn-new-activity'),
    btnEditActivity: $('btn-edit-activity'),
    btnDeleteActivity: $('btn-delete-activity'),
    noActivityPlaceholder: $('no-activity-placeholder'),
    mainContent: $('main-content'),

    thresholdAmount: $('threshold-amount'),
    initialAssets: $('initial-assets'),
    initialItems: $('initial-items'),
    gameSelect: $('game-select'),
    vipSelect: $('vip-select'),
    platformSelect: $('platform-select'),
    vipLevelRow: $('vip-level-row'),
    platformRow: $('platform-row'),
    depositTypeRow: $('deposit-type-row'),
    depositTypeSelect: $('deposit-type-select'),

    bonusConfigList: $('bonus-config-list'),
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
    pageInfo: $('page-info'),
    pageNumbers: $('page-numbers'),
    btnPageFirst: $('btn-page-first'),
    btnPagePrev: $('btn-page-prev'),
    btnPageNext: $('btn-page-next'),
    btnPageLast: $('btn-page-last'),

    // Modals
    bonusModal: $('bonus-modal'),
    bonusModalAmount: $('bonus-modal-amount'),
    bonusModalClose: $('bonus-modal-close'),
    bonusModalSave: $('bonus-modal-save'),
    bonusModalCancel: $('bonus-modal-cancel'),

    activityModal: $('activity-modal'),
    activityModalTitle: $('activity-modal-title'),
    activityNameInput: $('activity-name-input'),
    activityModalClose: $('activity-modal-close'),
    activityModalSave: $('activity-modal-save'),
    activityModalCancel: $('activity-modal-cancel'),

    rangeInputModal: $('range-input-modal'),
    rangeDisplay: $('range-display'),
    rangeActualInput: $('range-actual-input'),
    rangeInputConfirm: $('range-input-confirm'),
    rangeInputCancel: $('range-input-cancel'),

    confirmModal: $('confirm-modal'),
    confirmMessage: $('confirm-message'),
    confirmYes: $('confirm-yes'),
    confirmNo: $('confirm-no'),
};

// ===== 6. Custom Activity Select =====
function buildCustomSelectOptions() {
    const dropdown = els.activitySelectDropdown;
    dropdown.innerHTML = '';

    if (appState.activities.length === 0) {
        const opt = document.createElement('div');
        opt.className = 'custom-select-option';
        opt.dataset.value = '';
        opt.textContent = '— 請先新增活動 —';
        opt.setAttribute('role', 'option');
        dropdown.appendChild(opt);
        els.activitySelectText.textContent = '— 請先新增活動 —';
    } else {
        let currentName = '';
        appState.activities.forEach(a => {
            const opt = document.createElement('div');
            opt.className = 'custom-select-option';
            opt.dataset.value = a.id;
            opt.textContent = a.name;
            opt.setAttribute('role', 'option');
            if (a.id === appState.currentActivityId) {
                opt.classList.add('selected');
                currentName = a.name;
            }
            opt.addEventListener('click', () => {
                appState.currentActivityId = a.id;
                closeCustomSelect();
                saveState();
                renderAll();
            });
            dropdown.appendChild(opt);
        });
        if (!currentName && appState.activities.length > 0) {
            currentName = appState.activities.find(a => a.id === appState.currentActivityId)?.name
                || appState.activities[0].name;
        }
        els.activitySelectText.textContent = currentName || '— 請選擇活動 —';
    }
}

function openCustomSelect() {
    els.activitySelectDropdown.classList.add('open');
    els.activitySelectDisplay.setAttribute('aria-expanded', 'true');
}

function closeCustomSelect() {
    els.activitySelectDropdown.classList.remove('open');
    els.activitySelectDisplay.setAttribute('aria-expanded', 'false');
}

function toggleCustomSelect() {
    const isOpen = els.activitySelectDropdown.classList.contains('open');
    if (isOpen) closeCustomSelect();
    else openCustomSelect();
}

// ===== 7. UI Rendering =====
function renderMainVisibility() {
    const hasActivity = !!getCurrentActivity();
    els.noActivityPlaceholder.style.display = hasActivity ? 'none' : 'block';
    els.mainContent.style.display = hasActivity ? 'grid' : 'none';
    els.btnEditActivity.disabled = !hasActivity;
    els.btnDeleteActivity.disabled = !hasActivity;
}

function renderSettings() {
    const activity = getCurrentActivity();
    const session = getCurrentSession();
    if (!activity || !session) return;

    els.thresholdAmount.value = activity.threshold;
    els.initialAssets.value = session.initialAssets;
    els.initialItems.value = session.initialItems;
    els.gameSelect.value = session.game || 'game_a';
    els.vipSelect.value = session.vipLevel;
    els.platformSelect.value = session.platform;
    els.depositTypeSelect.value = session.depositType || 'coins';

    const gameInfo = getGameInfo(session.game);
    const isMahjong2 = session.game === 'mahjong2';
    const noVip = gameInfo?.noVip || false;

    // 層級顯示切換
    if (els.vipLevelRow) els.vipLevelRow.style.display = isMahjong2 ? 'none' : 'flex';
    if (els.platformRow) els.platformRow.style.display = isMahjong2 ? 'none' : 'flex';
    if (els.depositTypeRow) els.depositTypeRow.style.display = isMahjong2 ? 'flex' : 'none';

    // 若遊戲不分VIP，將VIP選單械灰提示 (滿貫大享等適用)
    els.vipSelect.disabled = noVip;
    els.vipSelect.style.opacity = noVip ? '0.45' : '1';
}

function renderDepositButtons() {
    const session = getCurrentSession();
    const activity = getCurrentActivity();
    if (!session || !activity) return;

    const gameInfo = getGameInfo(session.game);
    const amounts = getAmounts(session.game, session.platform, session.vipLevel);
    const container = els.depositButtons;
    container.innerHTML = '';

    // 更新幣別說明
    if (els.currencyNote) {
        els.currencyNote.textContent = gameInfo?.currencyNote || '';
    }

    if (amounts.length === 0) {
        const msg = document.createElement('p');
        msg.style.cssText = 'color: var(--text-muted); font-size: 0.9rem; text-align: center; padding: 1rem;';
        msg.textContent = '此遊戲/VIP/平台組合尚無品項資料';
        container.appendChild(msg);
        return;
    }

    amounts.forEach(amount => {
        const btn = document.createElement('button');
        btn.className = 'deposit-btn';
        btn.dataset.amount = amount;

        const bonusCfg = getBonusConfig(activity, session.platform, amount);
        const hasBonus = bonusCfg.assetBonusType !== 'none' || bonusCfg.itemBonusType !== 'none';
        if (hasBonus) btn.classList.add('has-bonus');

        // 金額標額
        const amountSpan = document.createElement('span');
        amountSpan.className = 'amount';
        amountSpan.textContent = formatNumber(amount);
        btn.appendChild(amountSpan);

        // 如果此遊戲有 depositItemMeta，顯示金幣/鑽石小字
        const meta = getDepositItemMeta(session.game, amount);
        if (meta) {
            const metaSpan = document.createElement('span');
            metaSpan.className = 'bonus-tag';
            const coinStr = meta.coins >= 100000000
                ? (meta.coins / 100000000).toFixed(1).replace(/\.0$/, '') + '億'
                : formatNumber(meta.coins);
            metaSpan.textContent = `金幣 ${coinStr} / 鑽石 ${formatNumber(meta.diamonds)}`;
            btn.appendChild(metaSpan);
        }

        // 如果有再加贈設定，顯示大基贈標簽
        if (hasBonus) {
            const parts = [];
            if (bonusCfg.assetBonusType === 'ratio') {
                parts.push(`+${bonusCfg.assetBonusValue}%`);
            } else if (bonusCfg.assetBonusType === 'fixed') {
                parts.push(`+${formatNumber(bonusCfg.assetBonusValue)}`);
            }
            const hasItemBonus = bonusCfg.itemBonusType !== 'none';
            if (bonusCfg.itemBonusType === 'fixed') parts.push(`道具+${bonusCfg.itemBonusFixed}`);
            else if (bonusCfg.itemBonusType === 'range') parts.push(`道具+${bonusCfg.itemBonusMin}~${bonusCfg.itemBonusMax}`);

            if (parts.length > 0) {
                const tagSpan = document.createElement('span');
                tagSpan.className = 'bonus-tag' + (hasItemBonus ? ' has-item-bonus' : '');
                tagSpan.textContent = parts.join(' ');
                btn.appendChild(tagSpan);
            }
        }

        btn.addEventListener('click', () => handleDeposit(amount));
        container.appendChild(btn);
    });
}

function renderBonusConfigList() {
    const session = getCurrentSession();
    const activity = getCurrentActivity();
    if (!session || !activity) return;

    const amounts = getAmounts(session.game, session.platform, session.vipLevel);
    const container = els.bonusConfigList;
    container.innerHTML = '';

    if (amounts.length === 0) {
        const msg = document.createElement('p');
        msg.style.cssText = 'color: var(--text-muted); font-size: 0.85rem; text-align: center; padding: 0.5rem;';
        msg.textContent = '無可設定品項';
        container.appendChild(msg);
        return;
    }

    amounts.forEach(amount => {
        const bonusCfg = getBonusConfig(activity, session.platform, amount);
        const hasBonus = bonusCfg.assetBonusType !== 'none' || bonusCfg.itemBonusType !== 'none';

        const item = document.createElement('div');
        item.className = 'bonus-config-item';

        const label = document.createElement('span');
        label.className = 'amount-label';
        label.textContent = formatNumber(amount);

        const info = document.createElement('span');
        info.className = 'bonus-info' + (hasBonus ? ' has-bonus' : '');
        if (hasBonus) {
            const parts = [];
            if (bonusCfg.assetBonusType === 'ratio') parts.push(`財產+${bonusCfg.assetBonusValue}%`);
            else if (bonusCfg.assetBonusType === 'fixed') parts.push(`財產+${formatNumber(bonusCfg.assetBonusValue)}`);
            if (bonusCfg.itemBonusType === 'fixed') parts.push(`道具+${bonusCfg.itemBonusFixed}`);
            else if (bonusCfg.itemBonusType === 'range') parts.push(`道具+${bonusCfg.itemBonusMin}~${bonusCfg.itemBonusMax}`);
            info.textContent = parts.join('、');
        } else {
            info.textContent = '未設定';
        }

        const btn = document.createElement('button');
        btn.className = 'bonus-config-btn';
        btn.textContent = '⚙';
        btn.title = '設定加贈';
        btn.addEventListener('click', () => openBonusModal(amount));

        item.appendChild(label);
        item.appendChild(info);
        item.appendChild(btn);
        container.appendChild(item);
    });
}

function renderStatus() {
    const activity = getCurrentActivity();
    const session = getCurrentSession();
    if (!activity || !session) return;

    const result = computeRecords(session, activity.threshold);

    els.currentAssetsDisplay.textContent = formatNumber(result.currentAssets);
    els.cumulativeDepositDisplay.textContent = formatNumber(result.cumulativeDeposit);
    els.nextMilestoneDisplay.textContent = activity.threshold > 0
        ? formatNumber(result.nextMilestoneDiff)
        : '—';
    els.milestoneItemsDisplay.textContent = formatNumber(result.totalMilestoneItems);
    els.totalItemsDisplay.textContent = formatNumber(result.totalItems);
}

function renderRecords() {
    const activity = getCurrentActivity();
    const session = getCurrentSession();
    if (!activity || !session) return;

    const result = computeRecords(session, activity.threshold);
    const allRecords = result.computed;
    const hasRecords = allRecords.length > 0;

    els.emptyRecords.style.display = hasRecords ? 'none' : 'block';
    els.tableWrapper.style.display = hasRecords ? 'block' : 'none';
    els.btnUndo.disabled = !hasRecords;
    els.btnClear.disabled = !hasRecords;

    if (!hasRecords) {
        els.paginationBar.style.display = 'none';
        els.btnDeleteSelected.disabled = true;
        return;
    }

    // Pagination
    const totalPages = Math.max(1, Math.ceil(allRecords.length / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;

    const startIdx = (currentPage - 1) * PAGE_SIZE;
    const endIdx = Math.min(startIdx + PAGE_SIZE, allRecords.length);
    const pageRecords = allRecords.slice(startIdx, endIdx);

    const tbody = els.recordTbody;
    tbody.innerHTML = '';

    pageRecords.forEach((rec, localIdx) => {
        const globalIdx = startIdx + localIdx;
        const isLast = globalIdx === allRecords.length - 1;
        const tr = document.createElement('tr');
        if (isLast) tr.classList.add('new-row');
        tr.dataset.recordIndex = globalIdx;

        // Checkbox cell
        const tdCheck = document.createElement('td');
        tdCheck.className = 'col-check';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.dataset.recordIndex = globalIdx;
        cb.addEventListener('change', onRowCheckboxChange);
        tdCheck.appendChild(cb);
        tr.appendChild(tdCheck);

        const cells = [
            rec.index,
            formatNumber(rec.depositAmount),
            rec.bonusAssets > 0 ? `+${formatNumber(rec.bonusAssets)}` : '-',
            rec.bonusItems > 0 ? `+${rec.bonusItems}` : '-',
            formatNumber(rec.assetsAfter),
            formatNumber(rec.cumulativeDeposit),
            rec.newMilestoneItems > 0 ? `+${rec.newMilestoneItems}` : '-',
            formatNumber(rec.totalMilestoneItems),
            formatNumber(rec.totalItems),
        ];

        cells.forEach((val, ci) => {
            const td = document.createElement('td');
            td.textContent = val;
            if (ci === 6 && rec.newMilestoneItems > 0) td.classList.add('milestone-new');
            if (ci === 8) td.classList.add('col-total');
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    // Reset select-all checkbox
    els.selectAllRecords.checked = false;
    els.selectAllRecords.indeterminate = false;
    els.btnDeleteSelected.disabled = true;

    // Pagination bar
    if (totalPages > 1) {
        els.paginationBar.style.display = 'flex';
        els.btnPageFirst.disabled = currentPage === 1;
        els.btnPagePrev.disabled = currentPage === 1;
        els.btnPageNext.disabled = currentPage === totalPages;
        els.btnPageLast.disabled = currentPage === totalPages;
        els.pageInfo.textContent = `第 ${currentPage} / ${totalPages} 頁，共 ${allRecords.length} 筆`;

        // Page number buttons
        const pn = els.pageNumbers;
        pn.innerHTML = '';
        const maxBtns = 7;
        let startPage = Math.max(1, currentPage - Math.floor(maxBtns / 2));
        let endPage = Math.min(totalPages, startPage + maxBtns - 1);
        if (endPage - startPage < maxBtns - 1) startPage = Math.max(1, endPage - maxBtns + 1);
        for (let p = startPage; p <= endPage; p++) {
            const pb = document.createElement('button');
            pb.className = 'page-number-btn' + (p === currentPage ? ' active' : '');
            pb.textContent = p;
            const pg = p;
            pb.addEventListener('click', () => { currentPage = pg; renderRecords(); });
            pn.appendChild(pb);
        }
    } else {
        els.paginationBar.style.display = 'none';
    }
}

function renderAll() {
    buildCustomSelectOptions();
    renderMainVisibility();
    if (getCurrentActivity()) {
        renderSettings();
        renderDepositButtons();
        renderBonusConfigList();
        renderStatus();
        currentPage = 1;
        renderRecords();
    }
}

// ===== 8. Record Selection =====
function onRowCheckboxChange() {
    const checkboxes = els.recordTbody.querySelectorAll('input[type="checkbox"]');
    const checked = [...checkboxes].filter(c => c.checked);
    els.selectAllRecords.checked = checked.length === checkboxes.length && checkboxes.length > 0;
    els.selectAllRecords.indeterminate = checked.length > 0 && checked.length < checkboxes.length;
    els.btnDeleteSelected.disabled = checked.length === 0;

    // Highlight selected rows
    checkboxes.forEach(cb => {
        const tr = cb.closest('tr');
        if (cb.checked) tr.classList.add('row-selected');
        else tr.classList.remove('row-selected');
    });
}

function getSelectedIndices() {
    const checkboxes = els.recordTbody.querySelectorAll('input[type="checkbox"]:checked');
    return [...checkboxes].map(cb => parseInt(cb.dataset.recordIndex));
}

// ===== 9. Deposit Logic =====
function handleDeposit(amount) {
    const activity = getCurrentActivity();
    const session = getCurrentSession();
    if (!activity || !session) return;

    const bonusCfg = getBonusConfig(activity, session.platform, amount);
    const bonusAssets = calculateBonusAssets(amount, bonusCfg);

    if (bonusCfg.itemBonusType === 'range') {
        openRangeInputModal(amount, bonusAssets, bonusCfg);
        return;
    }

    const bonusItems = bonusCfg.itemBonusType === 'fixed' ? (bonusCfg.itemBonusFixed || 0) : 0;
    addDepositRecord(amount, bonusAssets, bonusItems);
}

function addDepositRecord(depositAmount, bonusAssets, bonusItems) {
    const session = getCurrentSession();
    if (!session) return;

    session.records.push({ depositAmount, bonusAssets, bonusItems });
    // Go to last page when new record is added
    const totalPages = Math.max(1, Math.ceil(session.records.length / PAGE_SIZE));
    currentPage = totalPages;
    saveState();
    renderStatus();
    renderRecords();

    // Button click animation
    const btn = els.depositButtons.querySelector(`[data-amount="${depositAmount}"]`);
    if (btn) {
        btn.classList.add('clicked');
        setTimeout(() => btn.classList.remove('clicked'), 400);
    }
}

// ===== 10. Modal Handlers =====

// --- Activity Modal ---
let activityModalMode = 'new';

function openActivityModal(mode) {
    activityModalMode = mode;
    els.activityModalTitle.textContent = mode === 'new' ? '➕ 新增活動' : '✏️ 編輯活動名稱';
    els.activityNameInput.value = mode === 'edit' ? (getCurrentActivity()?.name || '') : '';
    els.activityModal.style.display = 'flex';
    els.activityNameInput.focus();
}

function closeActivityModal() {
    els.activityModal.style.display = 'none';
}

function saveActivityModal() {
    const name = els.activityNameInput.value.trim();
    if (!name) { els.activityNameInput.focus(); return; }

    if (activityModalMode === 'new') {
        const newActivity = createDefaultActivity(name);
        appState.activities.push(newActivity);
        appState.currentActivityId = newActivity.id;
    } else {
        const activity = getCurrentActivity();
        if (activity) activity.name = name;
    }

    saveState();
    closeActivityModal();
    renderAll();
}

// --- Bonus Modal ---
let bonusModalCurrentAmount = 0;

function openBonusModal(amount) {
    bonusModalCurrentAmount = amount;
    els.bonusModalAmount.textContent = formatNumber(amount);

    const activity = getCurrentActivity();
    const session = getCurrentSession();
    if (!activity || !session) return;

    const cfg = getBonusConfig(activity, session.platform, amount);

    document.querySelector(`input[name="asset-bonus-type"][value="${cfg.assetBonusType}"]`).checked = true;
    document.querySelector(`input[name="item-bonus-type"][value="${cfg.itemBonusType}"]`).checked = true;

    $('asset-bonus-value').value = cfg.assetBonusValue || 0;
    $('item-bonus-fixed').value = cfg.itemBonusFixed || 0;
    $('item-bonus-min').value = cfg.itemBonusMin || 0;
    $('item-bonus-max').value = cfg.itemBonusMax || 0;
    $('asset-bonus-unit').textContent = cfg.assetBonusType === 'ratio' ? '%' : '元';

    updateBonusModalVisibility();
    updateAssetBonusPreview();

    els.bonusModal.style.display = 'flex';
}

function closeBonusModal() {
    els.bonusModal.style.display = 'none';
}

function saveBonusModal() {
    const activity = getCurrentActivity();
    const session = getCurrentSession();
    if (!activity || !session) return;

    const assetType = document.querySelector('input[name="asset-bonus-type"]:checked').value;
    const itemType = document.querySelector('input[name="item-bonus-type"]:checked').value;

    const key = getBonusConfigKey(session.platform, bonusModalCurrentAmount);
    activity.bonusConfig[key] = {
        assetBonusType: assetType,
        assetBonusValue: parseFloat($('asset-bonus-value').value) || 0,
        itemBonusType: itemType,
        itemBonusFixed: parseInt($('item-bonus-fixed').value) || 0,
        itemBonusMin: parseInt($('item-bonus-min').value) || 0,
        itemBonusMax: parseInt($('item-bonus-max').value) || 0,
    };

    saveState();
    closeBonusModal();
    renderDepositButtons();
    renderBonusConfigList();
}

function updateBonusModalVisibility() {
    const assetType = document.querySelector('input[name="asset-bonus-type"]:checked').value;
    const itemType = document.querySelector('input[name="item-bonus-type"]:checked').value;

    $('asset-bonus-value-group').style.display = assetType !== 'none' ? 'block' : 'none';
    $('asset-bonus-unit').textContent = assetType === 'ratio' ? '%' : '元';
    $('item-bonus-fixed-group').style.display = itemType === 'fixed' ? 'block' : 'none';
    $('item-bonus-range-group').style.display = itemType === 'range' ? 'block' : 'none';
}

function updateAssetBonusPreview() {
    const assetType = document.querySelector('input[name="asset-bonus-type"]:checked').value;
    const val = parseFloat($('asset-bonus-value').value) || 0;
    const preview = $('asset-bonus-preview');
    if (!preview) return;

    if (assetType === 'ratio' && val > 0) {
        const bonus = Math.floor(bonusModalCurrentAmount * (val / 100));
        preview.textContent = `儲值 ${formatNumber(bonusModalCurrentAmount)} → 加贈 ${formatNumber(bonus)}（共 ${formatNumber(bonusModalCurrentAmount + bonus)}）`;
    } else if (assetType === 'fixed' && val > 0) {
        preview.textContent = `儲值 ${formatNumber(bonusModalCurrentAmount)} → 加贈 ${formatNumber(val)}（共 ${formatNumber(bonusModalCurrentAmount + val)}）`;
    } else {
        preview.textContent = '';
    }
}

// --- Range Input Modal ---
let rangeInputCallback = null;

function openRangeInputModal(amount, bonusAssets, bonusCfg) {
    els.rangeDisplay.textContent = `${bonusCfg.itemBonusMin} ~ ${bonusCfg.itemBonusMax} 個`;
    els.rangeActualInput.value = bonusCfg.itemBonusMin;
    els.rangeActualInput.min = bonusCfg.itemBonusMin;
    els.rangeActualInput.max = bonusCfg.itemBonusMax;
    rangeInputCallback = (actualItems) => { addDepositRecord(amount, bonusAssets, actualItems); };
    els.rangeInputModal.style.display = 'flex';
    els.rangeActualInput.focus();
    els.rangeActualInput.select();
}

function closeRangeInputModal() {
    els.rangeInputModal.style.display = 'none';
    rangeInputCallback = null;
}

function confirmRangeInput() {
    const val = parseInt(els.rangeActualInput.value) || 0;
    if (rangeInputCallback) rangeInputCallback(val);
    closeRangeInputModal();
}

// --- Confirm Modal ---
let confirmCallback = null;

function openConfirmModal(message, callback) {
    els.confirmMessage.textContent = message;
    confirmCallback = callback;
    els.confirmModal.style.display = 'flex';
}

function closeConfirmModal() {
    els.confirmModal.style.display = 'none';
    confirmCallback = null;
}

// ===== 11. Event Handlers =====
function initEventHandlers() {
    // Custom Activity Select
    els.activitySelectDisplay.addEventListener('click', toggleCustomSelect);
    els.activitySelectDisplay.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCustomSelect(); }
        if (e.key === 'Escape') closeCustomSelect();
    });
    document.addEventListener('click', (e) => {
        if (!els.activitySelectWrapper.contains(e.target)) closeCustomSelect();
    });

    // Activity buttons
    els.btnNewActivity.addEventListener('click', () => openActivityModal('new'));
    els.btnEditActivity.addEventListener('click', () => openActivityModal('edit'));
    els.btnDeleteActivity.addEventListener('click', () => {
        const activity = getCurrentActivity();
        if (!activity) return;
        openConfirmModal(`確定要刪除活動「${activity.name}」嗎？此操作無法復原。`, () => {
            appState.activities = appState.activities.filter(a => a.id !== activity.id);
            delete appState.sessions[activity.id];
            appState.currentActivityId = appState.activities.length > 0 ? appState.activities[0].id : null;
            saveState();
            renderAll();
        });
    });

    // Activity modal
    els.activityModalSave.addEventListener('click', saveActivityModal);
    els.activityModalCancel.addEventListener('click', closeActivityModal);
    els.activityModalClose.addEventListener('click', closeActivityModal);
    els.activityNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') saveActivityModal();
        if (e.key === 'Escape') closeActivityModal();
    });

    // Settings
    els.thresholdAmount.addEventListener('change', () => {
        const activity = getCurrentActivity();
        if (activity) {
            activity.threshold = parseInt(els.thresholdAmount.value) || 1;
            saveState();
            renderStatus();
            renderRecords();
        }
    });

    els.initialAssets.addEventListener('change', () => {
        const session = getCurrentSession();
        if (session) {
            session.initialAssets = parseInt(els.initialAssets.value) || 0;
            saveState(); renderStatus(); renderRecords();
        }
    });

    els.initialItems.addEventListener('change', () => {
        const session = getCurrentSession();
        if (session) {
            session.initialItems = parseInt(els.initialItems.value) || 0;
            saveState(); renderStatus(); renderRecords();
        }
    });

    els.gameSelect.addEventListener('change', () => {
        const session = getCurrentSession();
        if (session) {
            session.game = els.gameSelect.value;
            saveState(); renderDepositButtons(); renderBonusConfigList();
        }
    });

    els.vipSelect.addEventListener('change', () => {
        const session = getCurrentSession();
        if (session) {
            session.vipLevel = parseInt(els.vipSelect.value);
            saveState(); renderDepositButtons(); renderBonusConfigList();
        }
    });

    els.platformSelect.addEventListener('change', () => {
        const session = getCurrentSession();
        if (session) {
            session.platform = els.platformSelect.value;
            saveState(); renderDepositButtons(); renderBonusConfigList();
        }
    });

    // Custom deposit
    els.btnCustomDeposit.addEventListener('click', () => {
        const amount = parseInt(els.customAmount.value);
        if (amount && amount > 0) {
            handleDeposit(amount);
            els.customAmount.value = '';
        }
    });

    els.customAmount.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') els.btnCustomDeposit.click();
    });

    // Record selection
    els.selectAllRecords.addEventListener('change', () => {
        const checkboxes = els.recordTbody.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.checked = els.selectAllRecords.checked;
            const tr = cb.closest('tr');
            if (cb.checked) tr.classList.add('row-selected');
            else tr.classList.remove('row-selected');
        });
        els.btnDeleteSelected.disabled = !els.selectAllRecords.checked || checkboxes.length === 0;
    });

    // Delete selected
    els.btnDeleteSelected.addEventListener('click', () => {
        const indices = getSelectedIndices();
        if (indices.length === 0) return;
        openConfirmModal(`確定要刪除選取的 ${indices.length} 筆紀錄嗎？`, () => {
            const session = getCurrentSession();
            if (!session) return;
            // Remove in descending index order to not shift indices
            const sorted = [...indices].sort((a, b) => b - a);
            sorted.forEach(i => session.records.splice(i, 1));
            // Adjust page if needed
            const totalPages = Math.max(1, Math.ceil(session.records.length / PAGE_SIZE));
            if (currentPage > totalPages) currentPage = totalPages;
            saveState(); renderStatus(); renderRecords();
        });
    });

    // Undo
    els.btnUndo.addEventListener('click', () => {
        const session = getCurrentSession();
        if (session && session.records.length > 0) {
            session.records.pop();
            const totalPages = Math.max(1, Math.ceil(session.records.length / PAGE_SIZE));
            if (currentPage > totalPages) currentPage = totalPages;
            saveState(); renderStatus(); renderRecords();
        }
    });

    // Clear all
    els.btnClear.addEventListener('click', () => {
        openConfirmModal('確定要清除所有儲值紀錄嗎？', () => {
            const session = getCurrentSession();
            if (session) {
                session.records = [];
                currentPage = 1;
                saveState(); renderStatus(); renderRecords();
            }
        });
    });

    // Pagination
    els.btnPageFirst.addEventListener('click', () => { currentPage = 1; renderRecords(); });
    els.btnPagePrev.addEventListener('click', () => { if (currentPage > 1) { currentPage--; renderRecords(); } });
    els.btnPageNext.addEventListener('click', () => {
        const session = getCurrentSession();
        const activity = getCurrentActivity();
        if (!session || !activity) return;
        const totalPages = Math.max(1, Math.ceil(session.records.length / PAGE_SIZE));
        if (currentPage < totalPages) { currentPage++; renderRecords(); }
    });
    els.btnPageLast.addEventListener('click', () => {
        const session = getCurrentSession();
        const activity = getCurrentActivity();
        if (!session || !activity) return;
        currentPage = Math.max(1, Math.ceil(session.records.length / PAGE_SIZE));
        renderRecords();
    });

    // Bonus modal
    els.bonusModalSave.addEventListener('click', saveBonusModal);
    els.bonusModalCancel.addEventListener('click', closeBonusModal);
    els.bonusModalClose.addEventListener('click', closeBonusModal);

    document.querySelectorAll('input[name="asset-bonus-type"]').forEach(radio => {
        radio.addEventListener('change', () => { updateBonusModalVisibility(); updateAssetBonusPreview(); });
    });
    document.querySelectorAll('input[name="item-bonus-type"]').forEach(radio => {
        radio.addEventListener('change', updateBonusModalVisibility);
    });
    $('asset-bonus-value').addEventListener('input', updateAssetBonusPreview);

    // Range modal
    els.rangeInputConfirm.addEventListener('click', confirmRangeInput);
    els.rangeInputCancel.addEventListener('click', closeRangeInputModal);
    els.rangeActualInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') confirmRangeInput();
        if (e.key === 'Escape') closeRangeInputModal();
    });

    // Confirm modal
    els.confirmYes.addEventListener('click', () => { if (confirmCallback) confirmCallback(); closeConfirmModal(); });
    els.confirmNo.addEventListener('click', closeConfirmModal);

    // Close modals on overlay click
    [els.bonusModal, els.activityModal, els.rangeInputModal, els.confirmModal].forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.style.display = 'none';
        });
    });

    // Escape key closes modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            [els.bonusModal, els.activityModal, els.rangeInputModal, els.confirmModal].forEach(m => {
                if (m.style.display === 'flex') m.style.display = 'none';
            });
            closeCustomSelect();
        }
    });
}

// ===== 12. Initialization =====
function init() {
    loadState();

    if (appState.currentActivityId) {
        const exists = appState.activities.some(a => a.id === appState.currentActivityId);
        if (!exists) {
            appState.currentActivityId = appState.activities.length > 0 ? appState.activities[0].id : null;
        }
    }

    initEventHandlers();
    renderAll();
}

document.addEventListener('DOMContentLoaded', init);
