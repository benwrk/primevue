import { SharedUtils, dt, toVariables } from 'primevue/themes';

export default {
    regex: {
        rules: {
            class: {
                pattern: /^\.([a-zA-Z][\w-]*)$/,
                resolve(value) {
                    return { type: 'class', selector: value, value: value.trim().match(this.pattern)?.[1] };
                }
            },
            attr: {
                pattern: /^\[(.*)\]$/,
                resolve(value) {
                    return { type: 'attr', selector: `:root${value}`, value: value.trim().match(this.pattern)?.[1]?.split('=') };
                }
            },
            media: {
                pattern: /^@media (.*)$/,
                resolve(value) {
                    return { type: 'media', selector: `${value}{:root{[CSS]}}`, value: value.trim().match(this.pattern)?.[1] };
                }
            },
            system: {
                pattern: /^system$/,
                resolve(value) {
                    return { type: 'system', selector: '@media (prefers-color-scheme: dark){:root{[CSS]}}', value: this.pattern.test(value) ? 'system' : undefined };
                }
            },
            custom: {
                resolve(value) {
                    return { type: 'custom', selector: value, value: undefined };
                }
            }
        },
        resolve(value) {
            const rules = Object.keys(this.rules)
                .filter((k) => k !== 'custom')
                .map((r) => this.rules[r]);

            return [value].flat().map((v) => rules.map((r) => r.resolve(v)).find((rr) => !!rr.value) ?? this.rules.custom.resolve(v));
        }
    },
    getCommon({ name = '', theme = {}, params, set, defaults }) {
        const { base, preset } = theme;
        let primitive_css, semantic_css, global_css;

        if (SharedUtils.object.isNotEmpty(preset)) {
            const { options, extend } = theme;
            const { primitive, semantic } = preset;
            const { colorScheme, ...sRest } = semantic || {};
            const { dark, ...csRest } = colorScheme || {};
            const { primitive: primitiveExt, semantic: semanticExt } = extend || {};
            const { colorScheme: colorSchemeExt, ...sRestExt } = semanticExt || {};
            const { dark: darkExt, ...csRestExt } = colorSchemeExt || {};
            const prim_css = SharedUtils.object.isNotEmpty(primitive) ? this._toVariables({ primitive: { ...primitive, ...primitiveExt } }, options).declarations : '';
            const sRest_css = SharedUtils.object.isNotEmpty(sRest) ? this._toVariables({ semantic: { ...sRest, ...sRestExt } }, options).declarations : '';
            const csRest_css = SharedUtils.object.isNotEmpty(csRest) ? this._toVariables({ light: { ...csRest, ...csRestExt } }, options).declarations : '';
            const dark_css = SharedUtils.object.isNotEmpty(dark) ? this._toVariables({ dark: { ...dark, ...darkExt } }, options).declarations : '';

            primitive_css = this._transformCSS(name, prim_css, 'light', 'variable', options, set, defaults);
            semantic_css = `${this._transformCSS(name, `${sRest_css}${csRest_css}color-scheme:light`, 'light', 'variable', options, set, defaults)}${this._transformCSS(
                name,
                `${dark_css}color-scheme:dark`,
                'dark',
                'variable',
                options,
                set,
                defaults
            )}`;
        }

        global_css = SharedUtils.object.getItemValue(base?.components?.global?.css, { ...params, dt: (tokenPath, type) => dt(theme, tokenPath, type) });

        return {
            primitive: primitive_css,
            semantic: semantic_css,
            global: global_css
        };
    },
    getPresetC({ name = '', theme = {}, params, set, defaults }) {
        const { preset, options, extend } = theme;
        const { colorScheme, ...vRest } = preset?.components?.[name] || {};
        const { dark, ...csRest } = colorScheme || {};
        const { colorScheme: colorSchemeExt, ...vRestExt } = extend?.components?.[name] || {};
        const { dark: darkExt, ...csRestExt } = colorSchemeExt || {};
        const vRest_css = SharedUtils.object.isNotEmpty(vRest) ? this._toVariables({ [name]: { ...vRest, ...vRestExt } }, options).declarations : '';
        const csRest_css = SharedUtils.object.isNotEmpty(csRest) ? this._toVariables({ [name]: { ...csRest, ...csRestExt } }, options).declarations : '';
        const dark_css = SharedUtils.object.isNotEmpty(dark) ? this._toVariables({ [name]: { ...dark, ...darkExt } }, options).declarations : '';

        return `${this._transformCSS(name, `${vRest_css}${csRest_css}`, 'light', 'variable', options, set, defaults)}${this._transformCSS(name, dark_css, 'dark', 'variable', options, set, defaults)}`;
    },
    getBaseC({ name = '', theme = {}, params, set, defaults }) {
        const { base, options } = theme;
        const { css } = base?.components?.[name] || {};
        const computed_css = SharedUtils.object.getItemValue(css, { ...params, dt: (tokenPath, type) => dt(theme, tokenPath, type) });

        return this._transformCSS(name, computed_css, undefined, 'style', options, set, defaults);
    },
    getPresetD({ name = '', theme = {}, params, set, defaults }) {
        const { preset, options, extend } = theme;
        const { colorScheme, ...vRest } = preset?.directives?.[name] || {};
        const { dark, ...csRest } = colorScheme || {};
        const { colorScheme: colorSchemeExt, ...vRestExt } = extend?.directives?.[name] || {};
        const { dark: darkExt, ...csRestExt } = colorSchemeExt || {};
        const vRest_css = SharedUtils.object.isNotEmpty(vRest) ? this._toVariables({ [name]: { ...vRest, ...vRestExt } }, options).declarations : '';
        const csRest_css = SharedUtils.object.isNotEmpty(csRest) ? this._toVariables({ [name]: { ...csRest, ...csRestExt } }, options).declarations : '';
        const dark_css = SharedUtils.object.isNotEmpty(dark) ? this._toVariables({ [name]: { ...dark, ...darkExt } }, options).declarations : '';

        return `${this._transformCSS(name, `${vRest_css}${csRest_css}`, 'light', 'variable', options, set, defaults)}${this._transformCSS(name, dark_css, 'dark', 'variable', options, set, defaults)}`;
    },
    getBaseD({ name = '', theme = {}, params, set, defaults }) {
        const { base, options } = theme;
        const { css } = base?.directives?.[name] || {};
        const computed_css = SharedUtils.object.getItemValue(css, { ...params, dt: (tokenPath, type) => dt(theme, tokenPath, type) });

        return this._transformCSS(name, computed_css, undefined, 'style', options, set, defaults);
    },
    getColorSchemeOption(options, defaults) {
        return this.regex.resolve(options.darkModeSelector ?? defaults.darkModeSelector);
    },
    toggleColorScheme(options = {}, currentColorScheme, defaults) {
        const newColorScheme = currentColorScheme === 'dark' ? 'light' : 'dark';
        const defaultDocumentEl = SharedUtils.dom.isClient() ? window.document?.documentElement : undefined;

        if (defaultDocumentEl) {
            const colorSchemeOption = this.getColorSchemeOption(options, defaults);

            colorSchemeOption.forEach(({ type, value }) => {
                switch (type) {
                    case 'class':
                        SharedUtils.dom[newColorScheme === 'dark' ? 'addClass' : 'removeClass'](defaultDocumentEl, value);
                        break;

                    case 'attr':
                        newColorScheme === 'dark' ? defaultDocumentEl.setAttribute(value[0], value[1].replace(/['"]/g, '')) : defaultDocumentEl.removeAttribute(value[0]);
                        break;

                    default:
                        console.warn(`The 'toggleColorScheme' method cannot be used with the specified 'darkModeSelector' options.`);
                        break;
                }
            });
        }

        return newColorScheme;
    },
    getLayerOrder(name, options = {}, params, defaults) {
        const { cssLayer } = options;

        if (cssLayer) {
            const order = SharedUtils.object.getItemValue(cssLayer.order || defaults.cssLayer.order, params);

            return `@layer ${order}`;
        }

        return '';
    },
    getCommonStyleSheet({ name = '', theme = {}, params, props = {}, set, defaults }) {
        const common_css = this.getCommon({ name, theme, params, set, defaults });
        const _props = Object.entries(props)
            .reduce((acc, [k, v]) => acc.push(`${k}="${v}"`) && acc, [])
            .join(' ');

        return Object.entries(common_css || {})
            .reduce((acc, [key, value]) => {
                if (value) {
                    const _css = SharedUtils.object.minifyCSS(value);

                    acc.push(`<style type="text/css" data-primevue-style-id="${key}" ${_props}>${_css}</style>`);
                }

                return acc;
            }, [])
            .join('');
    },
    getStyleSheet({ name = '', theme = {}, params, props = {}, set, defaults }) {
        const presetC_css = this.getPresetC({ name, theme, params, set, defaults });
        const baseC_css = this.getBaseC({ name, theme, params, set, defaults });
        const _props = Object.entries(props)
            .reduce((acc, [k, v]) => acc.push(`${k}="${v}"`) && acc, [])
            .join(' ');

        let css = [];

        presetC_css && css.push(`<style type="text/css" data-primevue-style-id="${name}-variables" ${_props}>${SharedUtils.object.minifyCSS(presetC_css)}</style>`);
        baseC_css && css.push(`<style type="text/css" data-primevue-style-id="${name}-style" ${_props}>${SharedUtils.object.minifyCSS(baseC_css)}</style>`);

        return css.join('');
    },
    createTokens(obj = {}, currentColorScheme, defaults, parentKey = '', parentPath = '', tokens = {}) {
        Object.entries(obj).forEach(([key, value]) => {
            const currentKey = SharedUtils.object.test(defaults.variable.excludedKeyRegex, key) ? parentKey : parentKey ? `${parentKey}.${SharedUtils.object.toTokenKey(key)}` : SharedUtils.object.toTokenKey(key);
            const currentPath = parentPath ? `${parentPath}.${key}` : key;

            if (SharedUtils.object.isObject(value)) {
                this.createTokens(value, currentColorScheme, defaults, currentKey, currentPath, tokens);
            } else {
                tokens[currentKey] ||= {
                    paths: [],
                    computed(colorScheme) {
                        const scheme = colorScheme || currentColorScheme;

                        return this.paths.find((p) => p.scheme === scheme || p.scheme === 'none')?.computed();
                    }
                };
                tokens[currentKey].paths.push({
                    path: currentPath,
                    value,
                    scheme: currentPath.includes('colorScheme.light') ? 'light' : currentPath.includes('colorScheme.dark') ? 'dark' : 'none',
                    computed(colorScheme) {
                        const regex = /{([^}]*)}/g;

                        if (SharedUtils.object.test(regex, value)) {
                            const val = value.trim();
                            const _val = val.replaceAll(regex, (v) => {
                                const path = v.replace(/{|}/g, '');

                                return tokens[path]?.computed(colorScheme);
                            });

                            const calculationRegex = /(\d+\w*\s+[\+\-\*\/]\s+\d+\w*)/g;
                            const cleanedVarRegex = /var\([^)]+\)/g;

                            return SharedUtils.object.test(calculationRegex, _val.replace(cleanedVarRegex, '0')) ? `calc(${_val})` : _val;
                        }

                        return value;
                    }
                });
            }
        });

        return tokens;
    },
    getTokenValue(tokens, path, defaults) {
        const normalizePath = (str) => {
            const strArr = str.split('.');

            return strArr.filter((s) => !SharedUtils.object.test(defaults.variable.excludedKeyRegex, s.toLowerCase())).join('.');
        };

        const token = normalizePath(path);
        const colorScheme = path.includes('colorScheme.light') ? 'light' : path.includes('colorScheme.dark') ? 'dark' : undefined;

        return tokens[token]?.computed(colorScheme);
    },
    _toVariables(theme, options) {
        return toVariables(theme, { prefix: options?.prefix });
    },
    _transformCSS(name, css, mode, type, options = {}, set, defaults) {
        if (SharedUtils.object.isNotEmpty(css)) {
            const { cssLayer } = options;

            if (type !== 'style') {
                const colorSchemeOption = this.getColorSchemeOption(options, defaults);

                css =
                    mode === 'dark'
                        ? colorSchemeOption.reduce((acc, { selector }) => {
                              if (SharedUtils.object.isNotEmpty(selector)) {
                                  acc += selector.includes('[CSS]') ? selector.replace('[CSS]', css) : SharedUtils.object.getRule(selector, css);
                              }

                              return acc;
                          }, '')
                        : SharedUtils.object.getRule(':root', css);
            }

            if (cssLayer) {
                let layerOptions = { ...defaults.cssLayer };

                SharedUtils.object.isObject(cssLayer) && (layerOptions.name = SharedUtils.object.getItemValue(cssLayer.name, { name, type }));

                if (SharedUtils.object.isNotEmpty(layerOptions.name)) {
                    css = SharedUtils.object.getRule(`@layer ${layerOptions.name}`, css);
                    set?.layerNames(layerOptions.name);
                }
            }

            return css;
        }

        return '';
    }
};
