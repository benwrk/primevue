export default {
    css: ({ dt }) => `
.p-chips {
    display: inline-flex;
}

.p-chips-multiple-container {
    margin: 0;
    padding: 0;
    list-style-type: none;
    cursor: text;
    overflow: hidden;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 0.25rem 0.25rem;
    gap: 0.25rem;
    color: var(--p-chips-text-color);
    background: var(--p-chips-background);
    border: 1px solid var(--p-chips-border-color);
    border-radius: ${dt('rounded.base')};
    width: 100%;
    transition: background-color ${dt('transition.duration')}, color ${dt('transition.duration')}, border-color ${dt('transition.duration')}, outline-color ${dt('transition.duration')};
    outline-color: transparent;
    box-shadow: var(--p-chips-box-shadow);
}

.p-chips:not(.p-disabled):hover .p-chips-multiple-container {
    border-color:  var(--p-chips-border-color-hover);
}

.p-chips:not(.p-disabled).p-focus .p-chips-multiple-container {
    border-color: var(--p-chips-border-color-focus);
    outline: 0 none;
}

.p-chips.p-invalid .p-chips-multiple-container {
    border-color: var(--p-chips-border-color-invalid);
}

.p-variant-filled.p-chips-multiple-container {
    background: var(--p-chips-background-filled);
}

.p-chips:not(.p-disabled).p-focus .p-variant-filled.p-chips-multiple-container  {
    background: var(--p-chips-background-filled-focus);
}

.p-chips.p-disabled .p-chips-multiple-container {
    opacity: 1;
    background: var(--p-chips-background-disabled);
    color: var(--p-chips-text-color-disabled);
}

.p-chips-token {
    cursor: default;
    display: inline-flex;
    align-items: center;
    flex: 0 0 auto;
    padding: 0.25rem 0.75rem;
    background: var(--p-chips-chip-background);
    color: var(--p-chips-chip-text-color);
    border-radius: var(--p-rounded-sm);
}

.p-chips-token.p-focus {
    background: var(--p-chips-chip-background-focus);
    color: var(--p-chips-chip-text-color-focus);
}

.p-chips-input-token {
    flex: 1 1 auto;
    display: inline-flex;
}

.p-chips-token-icon {
    cursor: pointer;
    margin-left: 0.375rem;
}

.p-chips-input-token {
    padding: 0.25rem 0;
    margin-left: 0.5rem;
}

.p-chips-input-token input {
    border: 0 none;
    outline: 0 none;
    background-color: transparent;
    margin: 0;
    padding: 0;
    box-shadow: none;
    border-radius: 0;
    width: 100%;
    font-family: inherit;
    font-feature-settings: inherit;
    font-size: 1rem;
    color: inherit;
    padding: 0;
    margin: 0;
}

.p-chips-input-token input::placeholder {
    color: var(--p-chips-placeholder-text-color);
}

.p-fluid .p-chips {
    display: flex;
}
`
};