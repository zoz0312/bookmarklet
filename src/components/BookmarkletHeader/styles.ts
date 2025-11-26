import { css } from "@emotion/react";
import { theme } from "../../styles/theme.ts";

export const headerStyles = css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${theme.space[4]} ${theme.space[5]};
    background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryHover} 100%);
    border-radius: ${theme.radius.lg} ${theme.radius.lg} 0 0;
    cursor: move;
    user-select: none;
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.15);
    position: relative;

    &:active {
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
    }
`;

export const titleStyles = css`
    margin: 0;
    font-size: ${theme.fontSize.lg};
    font-weight: ${theme.fontWeight.bold};
    color: white;
    letter-spacing: -0.5px;
`;

export const closeButtonStyles = css`
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    font-family: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: ${theme.radius.md};
    color: white;
    font-size: ${theme.fontSize.lg};
    flex-shrink: 0;
    transition: background-color ${theme.transition.base}, transform ${theme.transition.fast};

    &:hover {
        background-color: rgba(255, 255, 255, 0.2);
        transform: rotate(90deg);
    }

    &:active {
        background-color: rgba(255, 255, 255, 0.3);
        transform: rotate(90deg) scale(0.95);
    }
`;