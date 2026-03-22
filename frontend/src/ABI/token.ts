

export const ETHASSIGN_ABI = [
    // Events
    "event Transfer(address indexed from, address indexed to, uint256 value)",
    "event Approval(address indexed owner, address indexed spender, uint256 value)",

    // Read-Only Functions (View)
    "function name() external view returns (string memory)",
    "function symbol() external view returns (string memory)",
    "function decimals() external view returns (uint8)",
    "function totalSupply() external view returns (uint256)",
    "function balanceOf(address account) external view returns (uint256)",
    "function allowance(address owner, address spender) external view returns (uint256)",

    // State-Changing Functions
    "function approve(address spender, uint256 value) external returns (bool)",
    "function transfer(address to, uint256 value) external returns (bool)",
    "function transferFrom(address from, address to, uint256 value) external returns (bool)",

    // Custom read functions
    "function MAX_SUPPLY() external view returns (uint256)",
    "function COOL_DOWN() external view returns (uint256)",
    "function CLAIM_AMOUNT() external view returns (uint256)",
    "function nextClaimTime(address user) external view returns (uint256)",

    // Custom write functions
    "function requestToken() external",
    "function mint(address to, uint256 amount) external",

    "error OwnableUnauthorizedAccount(address account)",
    "error OwnableInvalidOwner(address owner)",
    "error ERC20InsufficientBalance(address sender, uint256 balance, uint256 needed)",
    "error ERC20InsufficientAllowance(address spender, uint256 allowance, uint256 needed)",
]
