import { IconName } from "@/components/ui/Icons/icons";

// Available options: ACCEPT_ESCROW_ARTIST, ACCEPT_ESCROW_USER, ACCEPT_PROPOSAL, ACCEPT_REQUEST_ARTIST, ACTIVATE_PROPOSAL, ACTIVATE_TRANSACTION, ACTIVATE_VAULT, ADD_AUTHORITY, ADD_BALANCE_LIQUIDITY, ADD_BATCH_TRANSACTION, ADD_IMBALANCE_LIQUIDITY, ADD_INSTRUCTION, ADD_ITEM, ADD_LIQUIDITY, ADD_LIQUIDITY_BY_STRATEGY, ADD_LIQUIDITY_BY_STRATEGY_ONE_SIDE, ADD_LIQUIDITY_BY_WEIGHT, ADD_LIQUIDITY_ONE_SIDE, ADD_LIQUIDITY_ONE_SIDE_PRECISE, ADD_MEMBER, ADD_MEMBER_AND_CHANGE_THRESHOLD, ADD_METADATA, ADD_PAYMENT_MINT_PAYMENT_METHOD, ADD_RARITIES_TO_BANK, ADD_REWARDS, ADD_SPENDING_LIMIT, ADD_TO_POOL, ADD_TO_WHITELIST, ADD_TOKEN_TO_VAULT, ADD_TRAIT_CONFLICTS, ADMIN_SYNC_LIQUIDITY, APPROVE, APPROVE_PROPOSAL, APPROVE_TRANSACTION, ATTACH_METADATA, AUCTION_HOUSE_CREATE, AUCTION_MANAGER_CLAIM_BID, AUTHORIZE_FUNDER, BACKFILL_TOTAL_BLOCKS, BEGIN_TRAIT_UPDATE, BEGIN_VARIANT_UPDATE, BOOTSTRAP_LIQUIDITY, BORROW_CNFT_PERPETUAL, BORROW_FOX, BORROW_OBLIGATION_LIQUIDITY, BORROW_PERPETUAL, BORROW_SOL_FOR_NFT, BORROW_STAKED_BANX_PERPETUAL, BOT_CLAIM_SALE, BOT_DELIST, BOT_LIQUIDATE, BOT_LIQUIDATE_SELL, BOT_UNFREEZE, BOUND_HADO_MARKET_TO_FRAKT_MARKET, BURN, BURN_NFT, BURN_PAYMENT, BURN_PAYMENT_TREE, BUY_ITEM, BUY_LOAN, BUY_SUBSCRIPTION, BUY_TICKETS, CANCEL, CANCEL_ALL_AND_PLACE_ORDERS, CANCEL_ALL_ORDERS, CANCEL_ESCROW, CANCEL_LOAN_REQUEST, CANCEL_MULTIPLE_ORDERS, CANCEL_OFFER, CANCEL_ORDER, CANCEL_ORDER_BY_CLIENT_ORDER_ID, CANCEL_PROPOSAL, CANCEL_REWARD, CANCEL_SWAP, CANCEL_TRANSACTION, CANCEL_UP_TO, CANCEL_UPDATE, CANDY_MACHINE_ROUTE, CANDY_MACHINE_UNWRAP, CANDY_MACHINE_UPDATE, CANDY_MACHINE_WRAP, CHANGE_BLOCK_BUILDER, CHANGE_COMIC_STATE, CHANGE_FEE_RECIPIENT, CHANGE_MARKET_STATUS, CHANGE_SEAT_STATUS, CHANGE_THRESHOLD, CHANGE_TIP_RECEIVER, CLAIM_AUTHORITY, CLAIM_CNFT_PERPETUAL_LOAN, CLAIM_FEE, CLAIM_NFT, CLAIM_NFT_BY_LENDER_CNFT, CLAIM_NFT_BY_LENDER_PNFT, CLAIM_PERPETUAL_LOAN, CLAIM_REWARD, CLAIM_REWARDS, CLAIM_SALE, CLAIM_TIPS, CLEAN, CLOSE_ACCOUNT, CLOSE_BATCH_ACCOUNTS, CLOSE_BUNDLED_POSITION, CLOSE_CLAIM_STATUS, CLOSE_CONFIG, CLOSE_CONFIG_TRANSACTION_ACCOUNTS, CLOSE_ESCROW_ACCOUNT, CLOSE_ITEM, CLOSE_MARKET, CLOSE_OPEN_ORDERS_ACCOUNT, CLOSE_OPEN_ORDERS_INDEXER, CLOSE_ORDER, CLOSE_POOL, CLOSE_POSITION, CLOSE_PRESET_PARAMETER, CLOSE_TIP_DISTRIBUTION_ACCOUNT, CLOSE_VAULT_BATCH_TRANSACTION_ACCOUNT, CLOSE_VAULT_TRANSACTION_ACCOUNTS, COLLECT_FEES, COLLECT_REWARD, COMPRESS_NFT, COMPRESSED_NFT_BURN, COMPRESSED_NFT_CANCEL_REDEEM, COMPRESSED_NFT_DELEGATE, COMPRESSED_NFT_MINT, COMPRESSED_NFT_REDEEM, COMPRESSED_NFT_SET_VERIFY_COLLECTION, COMPRESSED_NFT_TRANSFER, COMPRESSED_NFT_UNVERIFY_COLLECTION, COMPRESSED_NFT_UNVERIFY_CREATOR, COMPRESSED_NFT_UPDATE_METADATA, COMPRESSED_NFT_VERIFY_COLLECTION, COMPRESSED_NFT_VERIFY_CREATOR, CONSUME_EVENTS, CONSUME_GIVEN_EVENTS, COPY_CLUSTER_INFO, COPY_GOSSIP_CONTACT_INFO, COPY_TIP_DISTRIBUTION_ACCOUNT, COPY_VOTE_ACCOUNT, CRANK, CRANK_EVENT_QUEUE, CREATE, CREATE_AMM, CREATE_APPRAISAL, CREATE_AVATAR, CREATE_AVATAR_CLASS, CREATE_BATCH, CREATE_BET, CREATE_BOND_AND_SELL_TO_OFFERS, CREATE_BOND_AND_SELL_TO_OFFERS_CNFT, CREATE_BOND_AND_SELL_TO_OFFERS_FOR_TEST, CREATE_BOND_OFFER_STANDARD, CREATE_COLLECTION, CREATE_CONFIG, CREATE_CONFIG_TRANSACTION, CREATE_ESCROW, CREATE_LOCK_ESCROW, CREATE_MARKET, CREATE_MASTER_EDITION, CREATE_MERKLE_TREE, CREATE_MINT_METADATA, CREATE_MULTISIG, CREATE_OPEN_ORDERS_ACCOUNT, CREATE_OPEN_ORDERS_INDEXER, CREATE_ORDER, CREATE_PAYMENT_METHOD, CREATE_PERPETUAL_BOND_OFFER, CREATE_POOL, CREATE_PROPOSAL, CREATE_RAFFLE, CREATE_STATS, CREATE_STORE, CREATE_TOKEN_POOL, CREATE_TRAIT, CREATE_TRANSACTION, CREATE_UNCHECKED, CREATE_VAULT_TRANSACTION, DEAUTHORIZE_FUNDER, DECOMPRESS_NFT, DECREASE_LIQUIDITY, DELEGATE_MERKLE_TREE, DELETE_COLLECTION, DELETE_POSITION_BUNDLE, DELETE_REFERRER_STATE_AND_SHORT_URL, DELETE_TOKEN_BADGE, DELIST_ITEM, DELIST_NFT, DEPOSIT, DEPOSIT_FRACTIONAL_POOL, DEPOSIT_GEM, DEPOSIT_OBLIGATION_COLLATERAL, DEPOSIT_RESERVE_LIQUIDITY, DEPOSIT_RESERVE_LIQUIDITY_AND_OBLIGATION_COLLATERAL, DEPOSIT_SOL_TO_FLASH_LOAN_POOL, DEPOSIT_TO_BOND_OFFER_STANDARD, DEPOSIT_TO_FARM_VAULT, DEPOSIT_TO_REWARDS_VAULT, DISTRIBUTE_COMPRESSION_REWARDS, EDIT_ORDER, EDIT_ORDER_PEGGED, EMPTY_PAYMENT_ACCOUNT, ENABLE_OR_DISABLE_POOL, EQUIP_TRAIT, EQUIP_TRAIT_AUTHORITY, EVICT_SEAT, EXECUTE_BATCH_TRANSACTION, EXECUTE_CONFIG_TRANSACTION, EXECUTE_INSTRUCTION, EXECUTE_LOAN, EXECUTE_MORTGAGE, EXECUTE_TRANSACTION, EXECUTE_VAULT_TRANSACTION, EXIT_VALIDATE_AND_SELL_TO_BOND_OFFERS_V2, EXPIRE, EXTEND_LOAN, EXTENSION_EXECUTE, FILL_ORDER, FINALIZE_PROGRAM_INSTRUCTION, FINISH_HADO_MARKET, FIX_POOL, FLASH_BORROW_RESERVE_LIQUIDITY, FLASH_REPAY_RESERVE_LIQUIDITY, FORCE_CANCEL_ORDERS, FORECLOSE_LOAN, FRACTIONALIZE, FREEZE, FUND_REWARD, FUSE, GET_POOL_INFO, GO_TO_A_BIN, HARVEST_REWARD, IDL_MISSING_TYPES, INCREASE_LIQUIDITY, INCREASE_ORACLE_LENGTH, INIT_AUCTION_MANAGER_V2, INIT_BANK, INIT_CLUSTER_HISTORY_ACCOUNT, INIT_CONFIG, INIT_CONFIG_EXTENSION, INIT_CUSTOMIZABLE_PERMISSIONLESS_CONSTANT_PRODUCT_POOL, INIT_FARM, INIT_FARMER, INIT_FARMS_FOR_RESERVE, INIT_FEE_TIER, INIT_LENDING_MARKET, INIT_OBLIGATION, INIT_OBLIGATION_FARMS_FOR_RESERVE, INIT_PERMISSIONED_POOL, INIT_PERMISSIONLESS_CONSTANT_PRODUCT_POOL_WITH_CONFIG, INIT_PERMISSIONLESS_CONSTANT_PRODUCT_POOL_WITH_CONFIG_2, INIT_PERMISSIONLESS_POOL, INIT_PERMISSIONLESS_POOL_WITH_FEE_TIER, INIT_POOL, INIT_POOL_V2, INIT_POSITION_BUNDLE, INIT_POSITION_BUNDLE_WITH_METADATA, INIT_REFERRER_STATE_AND_SHORT_URL, INIT_REFERRER_TOKEN_STATE, INIT_RENT, INIT_RESERVE, INIT_REWARD, INIT_REWARD_V2, INIT_STAKE, INIT_SWAP, INIT_TICK_ARRAY, INIT_TIP_DISTRIBUTION_ACCOUNT, INIT_TOKEN_BADGE, INIT_USER_METADATA, INIT_VALIDATOR_HISTORY_ACCOUNT, INIT_VAULT, INITIALIZE, INITIALIZE_ACCOUNT, INITIALIZE_BIN_ARRAY, INITIALIZE_BIN_ARRAY_BITMAP_EXTENSION, INITIALIZE_CUSTOMIZABLE_PERMISSIONLESS_LB_PAIR, INITIALIZE_FARM, INITIALIZE_FARM_DELEGATED, INITIALIZE_FLASH_LOAN_POOL, INITIALIZE_GLOBAL_CONFIG, INITIALIZE_HADO_MARKET, INITIALIZE_LB_PAIR, INITIALIZE_MARKET, INITIALIZE_PERMISSION_LB_PAIR, INITIALIZE_POSITION, INITIALIZE_POSITION_BY_OPERATOR, INITIALIZE_POSITION_PDA, INITIALIZE_PRESET_PARAMETER, INITIALIZE_REWARD, INITIALIZE_USER, INSTANT_REFINANCE_PERPETUAL_LOAN, KICK_ITEM, LEND_FOR_NFT, LIMIT_ORDER, LIQUIDATE, LIQUIDATE_BOND_ON_AUCTION_CNFT, LIQUIDATE_BOND_ON_AUCTION_PNFT, LIQUIDATE_OBLIGATION_AND_REDEEM_RESERVE_COLLATERAL, LIST_ITEM, LIST_NFT, LOAN, LOAN_FOX, LOCK, LOCK_REWARD, LOG, MAKE_PERPETUAL_MARKET, MAP_BANX_TO_POINTS, MERGE_CONDITIONAL_TOKENS, MERGE_STAKE, MIGRATE_BIN_ARRAY, MIGRATE_POSITION, MIGRATE_TO_PNFT, MINT_TO, NAME_SUCCESSOR, NFT_AUCTION_CANCELLED, NFT_AUCTION_CREATED, NFT_AUCTION_UPDATED, NFT_BID, NFT_BID_CANCELLED, NFT_CANCEL_LISTING, NFT_GLOBAL_BID, NFT_GLOBAL_BID_CANCELLED, NFT_LISTING, NFT_MINT, NFT_MINT_REJECTED, NFT_PARTICIPATION_REWARD, NFT_RENT_ACTIVATE, NFT_RENT_CANCEL_LISTING, NFT_RENT_END, NFT_RENT_LISTING, NFT_RENT_UPDATE_LISTING, NFT_SALE, OFFER_LOAN, OPEN_BUNDLED_POSITION, OPEN_POSITION, OPEN_POSITION_WITH_METADATA, OVERRIDE_CURVE_PARAM, PARTNER_CLAIM_FEE, PATCH_BROKEN_USER_STAKES, PAUSE, PAYOUT, PLACE_AND_TAKE_PERP_ORDER, PLACE_BET, PLACE_MULTIPLE_POST_ONLY_ORDERS, PLACE_ORDER, PLACE_ORDER_PEGGED, PLACE_ORDERS, PLACE_SOL_BET, PLACE_TAKE_ORDER, PLATFORM_FEE, POOL_CANCEL_PROPOSAL, POST_MULTI_PYTH, POST_PYTH, PROGRAM_CONFIG_INIT, PROGRAM_CONFIG_SET_AUTH, PROGRAM_CONFIG_SET_CREATION_FEE, PROGRAM_CONFIG_SET_TREASURY, PROPOSE_LOAN, PRUNE_ORDERS, REALLOC_CLUSTER_HISTORY_ACCOUNT, REALLOC_VALIDATOR_HISTORY_ACCOUNT, REBORROW_SOL_FOR_NFT, RECORD_RARITY_POINTS, REDEEM_CONDITIONAL_TOKENS, REDEEM_FEES, REDEEM_RESERVE_COLLATERAL, REDUCE_ORDER, REFILL, REFINANCE_FBOND_BY_LENDER, REFINANCE_PERPETUAL_LOAN, REFINANCE_TO_BOND_OFFERS_V2, REFINANCE_TO_BOND_OFFERS_V2_CNFT, REFRESH_FARM, REFRESH_FARMER, REFRESH_OBLIGATION, REFRESH_OBLIGATION_FARMS_FOR_RESERVE, REFRESH_RESERVE, REFRESH_RESERVES_BATCH, REFRESH_USER_STATE, REJECT_PROPOSAL, REJECT_SWAP, REJECT_TRANSACTION, REMOVE_ALL_LIQUIDITY, REMOVE_BALANCE_LIQUIDITY, REMOVE_BOND_OFFER_V2, REMOVE_FROM_POOL, REMOVE_FROM_WHITELIST, REMOVE_LIQUIDITY, REMOVE_LIQUIDITY_BY_RANGE, REMOVE_LIQUIDITY_SINGLE_SIDE, REMOVE_MEMBER, REMOVE_MEMBER_AND_CHANGE_THRESHOLD, REMOVE_PERPETUAL_OFFER, REMOVE_SPENDING_LIMIT, REMOVE_TRAIT, REMOVE_TRAIT_AUTHORITY, REPAY, REPAY_CNFT_PERPETUAL_LOAN, REPAY_COMPRESSED, REPAY_FBOND_TO_TRADE_TRANSACTIONS, REPAY_FBOND_TO_TRADE_TRANSACTIONS_CNFT, REPAY_FLASH_LOAN, REPAY_LOAN, REPAY_OBLIGATION_LIQUIDITY, REPAY_PARTIAL_PERPETUAL_LOAN, REPAY_PERPETUAL_LOAN, REPAY_STAKED_BANX, REPAY_STAKED_BANX_PERPETUAL_LOAN, REQUEST_ELEVATION_GROUP, REQUEST_LOAN, REQUEST_PNFT_MIGRATION, REQUEST_SEAT, REQUEST_SEAT_AUTHORIZED, RESCIND_LOAN, REVOKE, REWARD_USER_ONCE, SELL_LOAN, SELL_NFT, SELL_STAKED_BANX_TO_OFFERS, SET_ACTIVATION_POINT, SET_AUTHORITY, SET_BANK_FLAGS, SET_COLLECT_PROTOCOL_FEES_AUTHORITY, SET_CONFIG_AUTH, SET_CONFIG_EXTENSION_AUTHORITY, SET_DEFAULT_FEE_RATE, SET_DEFAULT_PROTOCOL_FEE_RATE, SET_DELEGATE, SET_FEE_AUTHORITY, SET_FEE_RATE, SET_MARKET_EXPIRED, SET_NEW_ADMIN, SET_NEW_ORACLE_AUTHORITY, SET_NEW_TIP_DISTRIBUTION_PROGRAM, SET_PARAMS, SET_POOL_FEES, SET_PRE_ACTIVATION_DURATION, SET_PRE_ACTIVATION_SWAP_ADDRESS, SET_PROTOCOL_FEE_RATE, SET_RENT_COLLECTOR, SET_REWARD_AUTHORITY, SET_REWARD_AUTHORITY_BY_SUPER_AUTHORITY, SET_REWARD_EMISSIONS, SET_REWARD_EMISSIONS_SUPER_AUTHORITY, SET_REWARD_EMISSIONS_V2, SET_STAKE_DELEGATED, SET_TIME_LOCK, SET_TOKEN_BADGE_AUTHORITY, SET_VAULT_LOCK, SET_WHITELISTED_VAULT, SETTLE_CONDITIONAL_VAULT, SETTLE_FUNDS, SETTLE_FUNDS_EXPIRED, SETTLE_PNL, SOCIALIZE_LOSS, SPLIT_STAKE, STAKE, STAKE_BANX, STAKE_SOL, STAKE_TOKEN, START_PNFT_MIGRATION, STUB_ID_BUILD, STUB_ORACLE_CLOSE, STUB_ORACLE_CREATE, STUB_ORACLE_SET, SWAP, SWAP_EXACT_OUT, SWAP_WITH_PRICE_IMPACT, SWEEP_FEES, SWITCH_FOX, SWITCH_FOX_REQUEST, SYNC_LIQUIDITY, TAKE_COMPRESSED_LOAN, TAKE_FLASH_LOAN, TAKE_LOAN, TAKE_MORTGAGE, TERMINATE_PERPETUAL_LOAN, THAW, TOGGLE_PAIR_STATUS, TOKEN_MINT, TOPUP, TRANSFER, TRANSFER_OWNERSHIP, TRANSFER_PAYMENT, TRANSFER_PAYMENT_TREE, TRANSFER_RECIPIENT, UNFREEZE, UNKNOWN, UNLABELED, UNPAUSE, UNSTAKE, UNSTAKE_BANX, UNSTAKE_SOL, UNSTAKE_TOKEN, UNSUB_OR_HARVEST_WEEKS, UNSUB_OR_HARVEST_WEEKS_ENHANCED, UPDATE, UPDATE_ACTIVATION_POINT, UPDATE_BANK_MANAGER, UPDATE_BOND_OFFER_STANDARD, UPDATE_CLASS_VARIANT_AUTHORITY, UPDATE_CLASS_VARIANT_METADATA, UPDATE_COLLECTION, UPDATE_COLLECTION_OR_CREATOR, UPDATE_CONFIG, UPDATE_EXTERNAL_PRICE_ACCOUNT, UPDATE_FARM, UPDATE_FARM_ADMIN, UPDATE_FARM_CONFIG, UPDATE_FEE_PARAMETERS, UPDATE_FEES_AND_REWARDS, UPDATE_FLOOR, UPDATE_GLOBAL_CONFIG, UPDATE_GLOBAL_CONFIG_ADMIN, UPDATE_HADO_MARKET_FEE, UPDATE_INTEREST_PERPETUAL_MARKET, UPDATE_ITEM, UPDATE_LENDING_MARKET, UPDATE_LENDING_MARKET_OWNER, UPDATE_OFFER, UPDATE_ORDER, UPDATE_PERPETUAL_MARKET, UPDATE_PERPETUAL_OFFER, UPDATE_POOL, UPDATE_POOL_COLLECTIONS, UPDATE_POOL_MORTGAGE, UPDATE_POOL_STATUS, UPDATE_POOL_WHITELIST, UPDATE_POSITION_OPERATOR, UPDATE_PRICING_V2, UPDATE_PRIMARY_SALE_METADATA, UPDATE_RAFFLE, UPDATE_RECORD_AUTHORITY_DATA, UPDATE_RESERVE_CONFIG, UPDATE_REWARD_DURATION, UPDATE_REWARD_FUNDER, UPDATE_STAKE_HISTORY, UPDATE_STAKING_SETTINGS, UPDATE_STATS, UPDATE_TRAIT_VARIANT, UPDATE_TRAIT_VARIANT_AUTHORITY, UPDATE_TRAIT_VARIANT_METADATA, UPDATE_USABLE_AMOUNT, UPDATE_VARIANT, UPDATE_VAULT_OWNER, UPGRADE_FOX, UPGRADE_FOX_REQUEST, UPGRADE_PROGRAM_INSTRUCTION, UPLOAD_MERKLE_ROOT, USE_SPENDING_LIMIT, VALIDATE_SAFETY_DEPOSIT_BOX_V2, VERIFY_PAYMENT_MINT, VERIFY_PAYMENT_MINT_TEST, VOTE, WHITELIST_CREATOR, WITHDRAW, WITHDRAW_FROM_BOND_OFFER_STANDARD, WITHDRAW_FROM_FARM_VAULT, WITHDRAW_GEM, WITHDRAW_INELIGIBLE_REWARD, WITHDRAW_LIQUIDITY, WITHDRAW_OBLIGATION_COLLATERAL, WITHDRAW_OBLIGATION_COLLATERAL_AND_REDEEM_RESERVE_COLLATERAL, WITHDRAW_PROTOCOL_FEE, WITHDRAW_PROTOCOL_FEES, WITHDRAW_REFERRER_FEES, WITHDRAW_REWARD, WITHDRAW_REWARDS_FROM_VAULT, WITHDRAW_SLASHED_AMOUNT, WITHDRAW_SOL_FROM_FLASH_LOAN_POOL, WITHDRAW_TREASURY, WITHDRAW_UNSTAKED_DEPOSITS 

export type TransactionType =
  "ACCEPT_ESCROW_ARTIST" |
  "ACCEPT_ESCROW_USER" |
  "ACCEPT_PROPOSAL" |
  "ACCEPT_REQUEST_ARTIST" |
  "ACTIVATE_PROPOSAL" |
  "ACTIVATE_TRANSACTION" |
  "ACTIVATE_VAULT" |
  "ADD_AUTHORITY" |
  "ADD_BALANCE_LIQUIDITY" |
  "ADD_BATCH_TRANSACTION" |
  "ADD_IMBALANCE_LIQUIDITY" |
  "ADD_INSTRUCTION" |
  "ADD_ITEM" |
  "ADD_LIQUIDITY" |
  "ADD_LIQUIDITY_BY_STRATEGY" |
  "ADD_LIQUIDITY_BY_STRATEGY_ONE_SIDE" |
  "ADD_LIQUIDITY_BY_WEIGHT" |
  "ADD_LIQUIDITY_ONE_SIDE" |
  "ADD_LIQUIDITY_ONE_SIDE_PRECISE" |
  "ADD_MEMBER" |
  "ADD_MEMBER_AND_CHANGE_THRESHOLD" |
  "ADD_METADATA" |
  "ADD_PAYMENT_MINT_PAYMENT_METHOD" |
  "ADD_RARITIES_TO_BANK" |
  "ADD_REWARDS" |
  "ADD_SPENDING_LIMIT" |
  "ADD_TO_POOL" |
  "ADD_TO_WHITELIST" |
  "ADD_TOKEN_TO_VAULT" |
  "ADD_TRAIT_CONFLICTS" |
  "ADMIN_SYNC_LIQUIDITY" |
  "APPROVE" |
  "APPROVE_PROPOSAL" |
  "APPROVE_TRANSACTION" |
  "ATTACH_METADATA";

export type Transaction = {
  description: string;
  type: TransactionType;
  source: string;
  fee: number;
  feePayer: string;
  signature: string;
  slot: number;
  timestamp: number;
  tokenTransfers: TokenTransfer[];
  nativeTransfers: NativeTransfer[];
  accountData: AccountData[];
  transactionError: any;
  instructions: Instruction[];
  events: Record<string, any>;
};

export type TokenTransfer = {
  fromUserAccount: string;
  toUserAccount: string;
  tokenMint?: string;
  amount?: number;
  tokenStandard?: string;
  tokenProgram?: string;
};

export type NativeTransfer = {
  fromUserAccount: string;
  toUserAccount: string;
  amount: number;
};

export type AccountData = {
  account: string;
  nativeBalanceChange: number;
  tokenBalanceChanges: TokenBalanceChange[];
};

export type TokenBalanceChange = {
  userAccount?: string;
  tokenAccount?: string;
  tokenMint?: string;
  rawTokenAmount?: {
    amount: string;
    decimals: number;
    uiAmount: number;
    uiAmountString: string;
  };
};

export type Instruction = {
  accounts: string[];
  data: string;
  programId: string;
  innerInstructions: InnerInstruction[];
};

export type InnerInstruction = {
  accounts: string[];
  data: string;
  programId: string;
};

export type TransactionList = Transaction[];


export type TransactionDetailsTableItems = {
  label: {
    label: string;
    rightIcon?: IconName;
    leftIcon?: IconName;
    caption?: string;
    info?: string;
  };
  value: {
    label: string;
    rightIcon?: IconName;
    leftIcon?: IconName;
    link?: string;
  };
}[];

export type TransactionDetailsStatusItems = {
  status: "not-started" | "complete" | "pending";
  label: string;
  subLabel?: string;
}[];

export type TransactionDetailsAsset = {
  name: string;
  amount: string;
  isLocked: boolean;
};


