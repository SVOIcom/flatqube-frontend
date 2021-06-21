export default {
    NAV_LINK_TEXT_SWAP: 'Swap',
    NAV_LINK_TEXT_POOL: 'Pool',
    NAV_LINK_TEXT_TOKENS: 'Tokens',
    NAV_LINK_TEXT_PAIRS: 'Pairs',

    WALLET_INSTALL_LINK_TEXT: 'Install Crystal Wallet',
    WALLET_INSTALL_NOTE: '<p>At the moment, only Crystal Wallet supports TON Swap.</p><p>If you haven\'t installed the extension yet, you can do it at <a href="https://chrome.google.com/webstore/category/extensions" target="_blank" rel="nofollow noopener noreferrer">chrome.google.com</a></p>',
    WALLET_BALANCE_HINT: '{balance} TON',
    WALLET_BTN_TEXT_CONNECT: 'Connect to a wallet',

    SWAP_CONNECTING_POPUP_TITLE: 'Connect to a wallet',
    SWAP_CONNECTING_POPUP_LEAD_WALLET_NAME: 'Crystal Wallet',
    SWAP_CONNECTING_POPUP_LEAD_IN_PROCESS: 'Initializing...',
    SWAP_HEADER_TITLE: 'Swap tokens',
    SWAP_SETTINGS_DROP_TITLE: 'Transaction Settings',
    SWAP_SETTINGS_DROP_NOTE: 'Slippage tolerance',
    SWAP_FIELD_TOKEN_WALLET_BALANCE: 'Balance: {balance}',
    SWAP_FIELD_LABEL_LEFT: 'From',
    SWAP_FIELD_LABEL_RIGHT: 'To',
    SWAP_FIELD_BTN_TEXT_SELECT_TOKEN: 'Select a token',
    SWAP_PRICE_LABEL: 'Price',
    SWAP_PRICE_RESULT: '<span>{value}</span> {leftSymbol} per {rightSymbol}',
    SWAP_BTN_TEXT_SELECT_A_TOKEN: 'Select a token',
    SWAP_BTN_TEXT_ENTER_AN_AMOUNT: 'Enter an amount',
    SWAP_BTN_TEXT_POOL_NOT_EXIST: 'Pool not exist',
    SWAP_BTN_TEXT_NOT_ENOUGH_LIQUIDITY: 'Not enough liquidity',
    SWAP_BTN_TEXT_SUBMIT: 'Swap',
    SWAP_BILL_LABEL_MINIMUM_RECEIVE: 'Minimum receive',
    SWAP_BILL_RESULT_MINIMUM_RECEIVE: '<span>{value}</span> {symbol}',
    SWAP_BILL_LABEL_PRICE_IMPACT: 'Price impact',
    SWAP_BILL_RESULT_PRICE_IMPACT: '<span>&lt;{value}%</span>',
    SWAP_BILL_LABEL_FEE: 'Liquidity Provider Fee',
    SWAP_BILL_RESULT_FEE: '<span>{value}</span> {symbol}',
    SWAP_TRANSACTION_RECEIPT_POPUP_TITLE: 'Swap receipt',
    SWAP_TRANSACTION_RECEIPT_LEAD_SUCCESSFUL_AMOUNT: '+ <span>{value}</span> {symbol}',
    SWAP_TRANSACTION_RECEIPT_SUCCESSFUL_NOTE: '<p>Swap completed successfully.</p><p>{symbol} token root <a href="https://ton-explorer.com/accounts/{address}" target="_blank" rel="nofollow noopener noreferrer">contract</a>.</p><p>You can view the result transaction in the <a href="https://ton-explorer.com/transactions/{transactionHash}" target="_blank" rel="nofollow noopener noreferrer">explorer</a>.</p>',
    SWAP_TRANSACTION_RECEIPT_LEAD_CANCELLED: 'Swap cancelled',
    SWAP_TRANSACTION_RECEIPT_CANCELLED_NOTE: '<p>The Swap was canceled. Your balance hasn\'t changed.</p>',
    SWAP_TRANSACTION_RECEIPT_BTN_TEXT_CLOSE: 'Close',

    TOKENS_LIST_POPUP_TITLE: 'Select a token',
    TOKENS_LIST_POPUP_FIELD_SEARCH_PLACEHOLDER: 'Enter a token name or address...',

    POOL_HEADER_TITLE: 'Add Liquidity',
    POOL_FIELD_TOKEN_WALLET_BALANCE: 'Balance: {balance}',
    POOL_FIELD_LABEL_LEFT: 'Left',
    POOL_FIELD_LABEL_RIGHT: 'Right',
    POOL_FIELD_BTN_TEXT_SELECT_TOKEN: 'Select a token',
    POOL_AUTO_EXCHANGE_TEXT: '<p>Enable auto exchange</p><p>In this case, <b>{leftSymbol}</b> will be automatically exchanged for <b>{rightSymbol}</b> for the missing amount to compensate for the difference.</p>',
    POOL_STEP_NOTE_LEAD_INIT: 'Initializing...',
    POOL_STEP_NOTE_LEAD_CHECK_ACCOUNT: 'Checking account...',
    POOL_STEP_NOTE_LEAD_CHECK_PAIR: 'Checking pool...',
    POOL_STEP_NOTE_LEAD_CONNECT_ACCOUNT: 'Account not connected',
    POOL_STEP_NOTE_LEAD_CONNECTING_ACCOUNT: 'Connecting account...',
    POOL_STEP_NOTE_LEAD_POOL_NOT_EXIST: 'Pool not exist',
    POOL_STEP_NOTE_LEAD_POOL_NOT_CONNECTED: 'Pool not connected',
    POOL_STEP_NOTE_LEAD_POOL_CONNECTING: 'Pool connecting...',
    POOL_STEP_NOTE_LEAD_POOL_CREATING: 'Creating pool...',
    POOL_STEP_NOTE_LEAD_AWAIT_TRANSACTION: 'Await transaction...',
    POOL_STEP_NOTE_LEAD_SUPPLYING: 'Supplying...',
    POOL_STEP_NOTE_TEXT_CONNECT_ACCOUNT: 'You need to connect account, before you can continue. Account connection for this wallet occurs only once. You will not need to go through this procedure in the future.',
    POOL_STEP_NOTE_TEXT_CONNECTING_ACCOUNT: 'You need to connect account, before you can continue. Account connection for this wallet occurs only once. You will not need to go through this procedure in the future.',
    POOL_STEP_NOTE_TEXT_SELECT_TOKEN: 'You need to select left and right pair token, before you can continue.',
    POOL_STEP_NOTE_TEXT_CREATE_POOL: 'You need to create pool, before you can to continue.',
    POOL_STEP_NOTE_TEXT_CONNECT_POOL: 'You need to connect this pool to your dex account, before you can to continue.',
    POOL_BTN_TEXT_INIT: 'Initializing',
    POOL_BTN_TEXT_CHECK_ACCOUNT: 'Checking...',
    POOL_BTN_TEXT_CONNECT_ACCOUNT: 'Connect account',
    POOL_BTN_TEXT_CONNECTING_ACCOUNT: 'Connecting...',
    POOL_BTN_TEXT_SELECT_PAIR: 'Select tokens',
    POOL_BTN_TEXT_ENTER_AN_AMOUNT: 'Enter an amount',
    POOL_BTN_TEXT_CHECK_PAIR: 'Checking pool...',
    POOL_BTN_TEXT_CREATE_POOL: 'Create pool',
    POOL_BTN_TEXT_CONNECT_POOL: 'Connect pool',
    POOL_BTN_TEXT_CREATING_POOL: 'Creating...',
    POOL_BTN_TEXT_CONNECTING_POOL: 'Connecting...',
    POOL_BTN_TEXT_DEPOSIT_TOKEN: 'Deposit {symbol}',
    POOL_BTN_TEXT_SUPPLY: 'Supply',
    POOL_BTN_TEXT_SUBMIT: 'Submit',
    POOL_DATA_SUBTITLE_DEX_ACCOUNT: 'TON Swap account balance',
    POOL_DEX_DATA_LABEL_LP_TOKENS: 'LP Tokens',
    POOL_DEX_DATA_LABEL_CURRENT_SHARE: 'Current share',
    POOL_DEX_DATA_RESULT_CURRENT_SHARE: '{value}%',
    POOL_ROOTS_INFO_LABEL_DEX_ADDRESS: 'TON Swap account address',
    POOL_ROOTS_INFO_LABEL_LP_ROOT: 'LP Root address',
    POOL_ROOTS_INFO_LABEL_PAIR_ROOT: 'Pool address',
    POOL_DATA_SUBTITLE_CURRENT_STATE: 'Pool data',
    POOL_DATA_LABEL_LP_SUPPLY: 'LP Supply',
    POOL_DATA_LABEL_LEFT_PRICE: '{leftSymbol} per {rightSymbol}',
    POOL_DATA_LABEL_RIGHT_PRICE: '{rightSymbol} per {leftSymbol}',
    POOL_DATA_LABEL_FEE: 'Fee',
    POOL_DATA_SUBTITLE_AFTER_SUPPLY: 'After supply',
    POOL_DATA_LABEL_SHARE_PERCENT: 'Share',
    POOL_DATA_RESULT_SHARE_PERCENT: '{value}%',
    POOL_DATA_LABEL_SHARE_CHANGE_PERCENT: 'Share change',
    POOL_DATA_RESULT_SHARE_CHANGE_PERCENT: '+ {value}%',
    POOL_DATA_LABEL_NEW_LEFT_PRICE: '{leftSymbol} per {rightSymbol}',
    POOL_DATA_LABEL_NEW_RIGHT_PRICE: '{rightSymbol} per {leftSymbol}',
    POOL_SUPPLY_RECEIPT_POPUP_TITLE: 'Supply receipt',
    POOL_SUPPLY_RECEIPT_LEAD_SUCCESSFUL_AMOUNT: '+ <span>{value}</span> LP',
    POOL_SUPPLY_RECEIPT_SUBTITLE_RESULT: 'Supply result',
    POOL_SUPPLY_RECEIPT_DATA_LABEL_SHARE_PERCENT: 'Share',
    POOL_SUPPLY_RECEIPT_DATA_RESULT_SHARE_PERCENT: '{value}%',
    POOL_SUPPLY_RECEIPT_DATA_LABEL_SHARE_CHANGE_PERCENT: 'Share change',
    POOL_SUPPLY_RECEIPT_DATA_RESULT_SHARE_CHANGE_PERCENT: '+ {value}%',
    POOL_SUPPLY_RECEIPT_DATA_LABEL_NEW_LEFT_PRICE: '{leftSymbol} per {rightSymbol}',
    POOL_SUPPLY_RECEIPT_DATA_LABEL_NEW_RIGHT_PRICE: '{rightSymbol} per {leftSymbol}',
    POOL_SUPPLY_RECEIPT_SUCCESSFUL_NOTE: '<p>Supply completed successfully.</p><p>LP token root <a href="https://ton-explorer.com/accounts/{address}" target="_blank" rel="nofollow noopener noreferrer">contract</a>.</p><p>You can view the result transaction in the <a href="https://ton-explorer.com/transactions/{transactionHash}" target="_blank" rel="nofollow noopener noreferrer">explorer</a>.</p>',
    POOL_SUPPLY_RECEIPT_LEAD_CANCELLED: 'Supply cancelled',
    POOL_SUPPLY_RECEIPT_CANCELLED_NOTE: '<p>The Supply was canceled. Your balance hasn\'t changed.</p>',
}
