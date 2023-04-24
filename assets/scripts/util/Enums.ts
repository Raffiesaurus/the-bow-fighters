export enum COLLIDER_GROUPS {
    PROJECTILE = 2,
    BODY = 4,
    LAND = 8,
    HEAD = 16,
    STEP = 32,
}

export enum BODY_ANIMS {
    WALK = 'char-walk',
    IDLE = 'char-idle',
    DIE = 'char-die',
}

export enum GAME_STATE {
    MAIN_MENU = 0,
    IN_GAME = 1,
    PAUSED = 2,
    RESUME = 3,
    WIN = 4,
    DEFEAT = 5,
    SETTINGS = 6,
}

export enum SFX {
    CLICK = 0,
    ARROW_BODY = 1,
    ARROW_GROUND = 2,
    FIRE_BOW = 3,
    JUMP = 4,
    POWERUP_ACTIVATE = 5,
    WALK = 6,
}