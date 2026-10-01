/* @ds-bundle: {"format":4,"namespace":"AndexorNetworkDesignSystem_d67969","components":[{"name":"Avatar","sourcePath":"components/data-display/Avatar.jsx"},{"name":"Badge","sourcePath":"components/data-display/Badge.jsx"},{"name":"Card","sourcePath":"components/data-display/Card.jsx"},{"name":"Stat","sourcePath":"components/data-display/Stat.jsx"},{"name":"Tag","sourcePath":"components/data-display/Tag.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"IconButton","sourcePath":"components/forms/IconButton.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"}],"sourceHashes":{"components/data-display/Avatar.jsx":"370d68d6ca88","components/data-display/Badge.jsx":"e53fd3d23e69","components/data-display/Card.jsx":"c903e4017bd0","components/data-display/Stat.jsx":"687cdb743b4e","components/data-display/Tag.jsx":"f12852809ace","components/forms/Button.jsx":"9b1f01b31df3","components/forms/IconButton.jsx":"b4b5611f6ff9","components/forms/Input.jsx":"2ca434e65565","components/forms/Switch.jsx":"2f12989e8655","ui_kits/marketing-site-original/tweaks-panel.jsx":"d3bcc864ad58","ui_kits/marketing-site/App.jsx":"5ef7a32fbc6a","ui_kits/marketing-site/CTA.jsx":"8a41f24e3ebb","ui_kits/marketing-site/ContactUs.jsx":"e9fdc75e6d69","ui_kits/marketing-site/Footer.jsx":"ccbc4da89f3d","ui_kits/marketing-site/Header.jsx":"8e8cdb7ba7f7","ui_kits/marketing-site/Hero.jsx":"27fc10589563","ui_kits/marketing-site/Icon.jsx":"40154b951f7b","ui_kits/marketing-site/Results.jsx":"d253eaaf00a2","ui_kits/marketing-site/Services.jsx":"bf17442027b9","ui_kits/marketing-site/Testimonial.jsx":"d8fdb09b130e","ui_kits/marketing-site/tweaks-panel.jsx":"d3bcc864ad58"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.AndexorNetworkDesignSystem_d67969 = window.AndexorNetworkDesignSystem_d67969 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/data-display/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Avatar with image or initials fallback. */
function Avatar({
  src,
  name = '',
  size = 'md',
  className = '',
  ...rest
}) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ['an-avatar', `an-avatar--${size}`, className].filter(Boolean).join(' ')
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name
  }) : initials);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Compact status / category label. */
function Badge({
  tone = 'neutral',
  dot = false,
  className = '',
  children,
  ...rest
}) {
  const cls = ['an-badge', `an-badge--${tone}`, dot && 'an-badge--dot', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Surface container. Set `pad` for default padding, `hover` for lift, `ink` for dark blue. */
function Card({
  pad = true,
  hover = false,
  ink = false,
  as: Tag = 'div',
  className = '',
  children,
  ...rest
}) {
  const cls = ['an-card', pad && 'an-card--pad', hover && 'an-card--hover', ink && 'an-card--ink', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Card.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Stat.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Big metric with a mono label. */
function Stat({
  value,
  label,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: className
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "an-stat__value"
  }, value), /*#__PURE__*/React.createElement("div", {
    className: "an-stat__label"
  }, label));
}
Object.assign(__ds_scope, { Stat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Stat.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Pill tag, optionally removable. */
function Tag({
  onRemove,
  className = '',
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ['an-tag', className].filter(Boolean).join(' ')
  }, rest), children, onRemove && /*#__PURE__*/React.createElement("span", {
    className: "an-tag__x",
    role: "button",
    "aria-label": "Remove",
    onClick: onRemove
  }, "\xD7"));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Tag.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Andexor primary action control. Renders a <button> (or any element via `as`).
 */
function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  onInk = false,
  leftIcon,
  rightIcon,
  as: Tag = 'button',
  className = '',
  children,
  ...rest
}) {
  const cls = ['an-btn', `an-btn--${variant}`, size === 'sm' && 'an-btn--sm', size === 'lg' && 'an-btn--lg', block && 'an-btn--block', onInk && 'an-btn--on-ink', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls
  }, rest), leftIcon, children, rightIcon);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Square, icon-only button. Provide an accessible `aria-label`. */
function IconButton({
  bordered = false,
  size = 'md',
  className = '',
  children,
  ...rest
}) {
  const cls = ['an-iconbtn', bordered && 'an-iconbtn--bordered', size === 'sm' && 'an-iconbtn--sm', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Labelled text input with optional hint / error message. */
function Input({
  label,
  hint,
  error,
  id,
  className = '',
  ...rest
}) {
  const fieldId = id || (label ? `an-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return /*#__PURE__*/React.createElement("div", {
    className: "an-field"
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "an-label",
    htmlFor: fieldId
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    className: ['an-input', error && 'an-input--invalid', className].filter(Boolean).join(' '),
    "aria-invalid": error ? 'true' : undefined
  }, rest)), error ? /*#__PURE__*/React.createElement("span", {
    className: "an-hint an-hint--error"
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    className: "an-hint"
  }, hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Toggle switch. Controlled via `checked` + `onChange`. */
function Switch({
  checked,
  onChange,
  accent = false,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: ['an-switch', accent && 'an-switch--accent', className].filter(Boolean).join(' ')
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    checked: checked,
    onChange: onChange
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "an-switch__track"
  }, /*#__PURE__*/React.createElement("span", {
    className: "an-switch__thumb"
  })));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site-original/tweaks-panel.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).

/* BEGIN USAGE */
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
// Exports (to window): useTweaks, TweaksPanel, TweakSection, TweakRow, TweakSlider,
//   TweakToggle, TweakRadio, TweakSelect, TweakText, TweakNumber, TweakColor, TweakButton.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261B", "#F6F4EF"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261B', '#F6F4EF'],
//                                  ['#475569', '#0F172A', '#F1F5F9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// TweakRadio is the segmented control for 2–3 short options (auto-falls-back to
// TweakSelect past ~16/~10 chars per label); reach for TweakSelect directly when
// options are many or long. For color tweaks always curate 3-4 options rather than
// a free picker; an option can also be a whole 2–5 color palette (the stored value
// is the array). The Tweak* controls are a floor, not a ceiling — build custom
// controls inside the panel if a tweak calls for UI they don't cover.
/* END USAGE */
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261B;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261B}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#FFF;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#FFF;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34C759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#FFF;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#FFF;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : {
      [keyOrEdits]: val
    };
    setValues(prev => ({
      ...prev,
      ...edits
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits
    }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', {
      detail: edits
    }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({
  title = 'Tweaks',
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = e => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, __TWEAKS_STYLE), /*#__PURE__*/React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    "data-omelette-chrome": "",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement("button", {
    className: "twk-x",
    "aria-label": "Close tweaks",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "twk-body"
  }, children)));
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "twk-sect"
  }, label), children);
}
function TweakRow({
  label,
  value,
  children,
  inline = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: inline ? 'twk-row twk-row-h' : 'twk-row'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label), value != null && /*#__PURE__*/React.createElement("span", {
    className: "twk-val"
  }, value)), children);
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label,
    value: `${value}${unit}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakToggle({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "twk-toggle",
    "data-on": value ? '1' : '0',
    role: "switch",
    "aria-checked": !!value,
    onClick: () => onChange(!value)
  }, /*#__PURE__*/React.createElement("i", null)));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = o => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({
    2: 16,
    3: 10
  }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = s => {
      const m = options.find(o => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return /*#__PURE__*/React.createElement(TweakSelect, {
      label: label,
      value: value,
      options: options,
      onChange: s => onChange(resolve(s))
    });
  }
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;
  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = e => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = ev => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    role: "radiogroup",
    onPointerDown: onPointerDown,
    className: dragging ? 'twk-seg dragging' : 'twk-seg'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": o.value === value
  }, o.label))));
}
function TweakSelect({
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("select", {
    className: "twk-field",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })));
}
function TweakText({
  label,
  value,
  placeholder,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("input", {
    className: "twk-field",
    type: "text",
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakNumber({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) {
  const clamp = n => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({
    x: 0,
    val: 0
  });
  const onScrubStart = e => {
    e.preventDefault();
    startRef.current = {
      x: e.clientX,
      val: value
    };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = ev => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "twk-num-lbl",
    onPointerDown: onScrubStart
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: e => onChange(clamp(Number(e.target.value)))
  }), unit && /*#__PURE__*/React.createElement("span", {
    className: "twk-num-unit"
  }, unit));
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #FAFAFA without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, c => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = n >> 16 & 255,
    g = n >> 8 & 255,
    b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}
const __TwkCheck = ({
  light
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 14 14",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M3 7.2 5.8 10 11 4.2",
  fill: "none",
  strokeWidth: "2.2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  stroke: light ? 'rgba(0,0,0,.78)' : '#FFF'
}));

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({
  label,
  value,
  options,
  onChange
}) {
  if (!options || !options.length) {
    return /*#__PURE__*/React.createElement("div", {
      className: "twk-row twk-row-h"
    }, /*#__PURE__*/React.createElement("div", {
      className: "twk-lbl"
    }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("input", {
      type: "color",
      className: "twk-swatch",
      value: value,
      onChange: e => onChange(e.target.value)
    }));
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = o => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-chips",
    role: "radiogroup"
  }, options.map((o, i) => {
    const colors = Array.isArray(o) ? o : [o];
    const [hero, ...rest] = colors;
    const sup = rest.slice(0, 4);
    const on = key(o) === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      className: "twk-chip",
      role: "radio",
      "aria-checked": on,
      "data-on": on ? '1' : '0',
      "aria-label": colors.join(', '),
      title: colors.join(' · '),
      style: {
        background: hero
      },
      onClick: () => onChange(o)
    }, sup.length > 0 && /*#__PURE__*/React.createElement("span", null, sup.map((c, j) => /*#__PURE__*/React.createElement("i", {
      key: j,
      style: {
        background: c
      }
    }))), on && /*#__PURE__*/React.createElement(__TwkCheck, {
      light: __twkIsLight(hero)
    }));
  })));
}
function TweakButton({
  label,
  onClick,
  secondary = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: secondary ? 'twk-btn secondary' : 'twk-btn',
    onClick: onClick
  }, label);
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site-original/tweaks-panel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/App.jsx
try { (() => {
/* Expressive tweaks — three controls that reshape the whole page's feel by
   remapping design tokens at the :root level (accent ramp, ink surfaces,
   spatial rhythm), not by pixel-pushing one element. */

const SIGNAL_RAMPS = {
  // 50 → 800
  gold: ['#FEF9EA', '#FDF2D4', '#FBE4A3', '#F8D066', '#F4BD2E', '#EAAA00', '#C08C00', '#9C7100', '#7A5900'],
  electric: ['#EEF6FF', '#D9EBFF', '#B6D8FF', '#83BDFF', '#4A9BFF', '#1A7FFF', '#0B63D6', '#0A4EA8', '#0B3F83'],
  emerald: ['#ECFDF3', '#D1FAE0', '#A7F3C4', '#6EE7A3', '#34D17E', '#12B866', '#0A9455', '#0A7546', '#0B5D39']
};
const RAMP_STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800];
const CANVAS_INKS = {
  blue: ['#002855', '#001B3A'],
  carbon: ['#141B26', '#0B0F17'],
  twilight: ['#211D4D', '#161235']
};
const RHYTHM = {
  compact: {
    section: '32px',
    hero: '29px'
  },
  balanced: {
    section: '48px',
    hero: '48px'
  },
  airy: {
    section: '69px',
    hero: '62px'
  }
};
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "signal": "gold",
  "canvas": "blue",
  "rhythm": "compact"
} /*EDITMODE-END*/;
function App() {
  const [proposal, setProposal] = React.useState(false);
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const open = () => setProposal(true);
  React.useEffect(() => {
    const root = document.documentElement;

    // 1 · Signal color — remap the whole accent ramp so eyebrows, badges,
    //     buttons, checkmarks, glows and focus states all recolor coherently.
    const ramp = SIGNAL_RAMPS[t.signal] || SIGNAL_RAMPS.gold;
    RAMP_STOPS.forEach((stop, i) => root.style.setProperty('--gold-' + stop, ramp[i]));
    root.style.setProperty('--accent', ramp[5]);
    root.style.setProperty('--focus-ring', ramp[5]);
    root.style.setProperty('--selection-bg', ramp[2]);

    // 2 · Dark canvas — swap the ink surfaces used by the hero and results band.
    const ink = CANVAS_INKS[t.canvas] || CANVAS_INKS.blue;
    root.style.setProperty('--surface-ink', ink[0]);
    root.style.setProperty('--surface-ink-2', ink[1]);

    // 3 · Rhythm — spatial density across every section (+ the hero, whose
    //     padding is inline, via a small injected rule).
    const r = RHYTHM[t.rhythm] || RHYTHM.balanced;
    root.style.setProperty('--section-y', r.section);
    let st = document.getElementById('tweak-rhythm');
    if (!st) {
      st = document.createElement('style');
      st.id = 'tweak-rhythm';
      document.head.appendChild(st);
    }
    st.textContent = '.an-hero-grid{padding-top:' + r.hero + '!important;padding-bottom:' + r.hero + '!important}';
  }, [t.signal, t.canvas, t.rhythm]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Hero, {
    onProposal: open
  }), /*#__PURE__*/React.createElement(Services, null), /*#__PURE__*/React.createElement(CTA, {
    onProposal: open
  }), /*#__PURE__*/React.createElement(Footer, null), /*#__PURE__*/React.createElement(ContactUs, {
    open: proposal,
    onClose: () => setProposal(false)
  }), /*#__PURE__*/React.createElement(TweaksPanel, null, /*#__PURE__*/React.createElement(TweakSection, {
    label: "Feel \u2014 reshape the whole page"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 4px',
      fontSize: '11px',
      lineHeight: 1.45,
      opacity: 0.6
    }
  }, "Each control remaps design tokens across every section, not one element.")), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Signal color",
    value: t.signal,
    options: ['gold', 'electric', 'emerald'],
    onChange: v => setTweak('signal', v)
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Dark canvas",
    value: t.canvas,
    options: ['blue', 'carbon', 'twilight'],
    onChange: v => setTweak('canvas', v)
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Rhythm",
    value: t.rhythm,
    options: ['compact', 'balanced', 'airy'],
    onChange: v => setTweak('rhythm', v)
  })));
}
window.App = App;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/CTA.jsx
try { (() => {
const {
  Button
} = window.AndexorNetworkDesignSystem_d67969;
function CTA({
  onProposal
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 'var(--container-xl)',
      margin: '0 auto',
      padding: '0 24px var(--section-y)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '24px',
      background: 'var(--blue-800)',
      padding: '56px 48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '32px',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: '620px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      color: '#FFF',
      fontSize: 'clamp(28px,3.4vw,40px)',
      letterSpacing: '-0.02em',
      margin: 0,
      lineHeight: 1.1,
      maxWidth: '12.28em'
    }
  }, "Let's talk about your needs and explore solutions, then plan the way forward.")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: '320px',
      height: '320px',
      transform: 'translate(-50%, -50%)',
      background: 'radial-gradient(circle, color-mix(in srgb, var(--gold-500) 12%, transparent), transparent 48%)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "lg",
    rightIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 18
    }),
    onClick: onProposal
  }, "Contact Us")))));
}
Object.assign(window, {
  CTA
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/CTA.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/ContactUs.jsx
try { (() => {
const {
  Button,
  Input
} = window.AndexorNetworkDesignSystem_d67969;
function ContactUs({
  open,
  onClose,
  inline = false,
  initialSent = false
}) {
  const [sent, setSent] = React.useState(initialSent);
  React.useEffect(() => {
    if (open && !inline) setSent(false);
  }, [open]);
  if (!open && !inline) return null;
  const panel = /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: 'min(480px, 100%)',
      background: 'var(--blue-500)',
      borderRadius: '18px',
      boxShadow: 'var(--shadow-xl)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--blue-800)',
      padding: '22px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      left: '-110px',
      top: '-110px',
      width: '260px',
      height: '260px',
      background: 'radial-gradient(circle, color-mix(in srgb, var(--gold-500) 12%, transparent), transparent 48%)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: window.__resources && window.__resources.logoBoxed || "../../assets/logo/andexor-logo.svg",
    alt: "",
    style: {
      position: 'relative',
      width: '34px',
      height: '34px',
      borderRadius: '8px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      lineHeight: 1.2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#FFF',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: '30px',
      lineHeight: '34px'
    }
  }, "Contact Us")), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close",
    style: {
      position: 'relative',
      marginLeft: 'auto',
      background: 'transparent',
      border: 'none',
      color: 'var(--blue-200)',
      cursor: 'pointer',
      padding: '4px'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 20
  }))), sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '40px 28px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '56px',
      height: '56px',
      borderRadius: '999px',
      background: 'var(--success-100)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
      color: 'var(--success-600)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 28,
    stroke: 2.5
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 8px',
      fontSize: '22px',
      color: '#FFF'
    }
  }, "Request received"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 auto',
      maxWidth: '34ch',
      color: 'var(--blue-100)',
      fontSize: '14px',
      lineHeight: 1.55
    }
  }, "Thanks for reaching out. A strategist will review your site and contact you soon."), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    style: {
      marginTop: '22px'
    },
    onClick: onClose
  }, "Done")) : /*#__PURE__*/React.createElement("form", {
    className: "an-modal-form",
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
    },
    style: {
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Full name",
    placeholder: "Jordan Reyes",
    required: true
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Work email",
    type: "email",
    placeholder: "you@company.com",
    required: true
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Company website",
    placeholder: "company.com",
    required: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "an-field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "an-label",
    htmlFor: "svc"
  }, "Primary need"), /*#__PURE__*/React.createElement("select", {
    id: "svc",
    className: "an-input",
    defaultValue: "",
    required: true,
    style: {
      appearance: 'none',
      backgroundImage: 'none'
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, "Select a service\u2026"), /*#__PURE__*/React.createElement("optgroup", {
    label: "Technical Services"
  }, /*#__PURE__*/React.createElement("option", null, "Web Development"), /*#__PURE__*/React.createElement("option", null, "Web Hosting"), /*#__PURE__*/React.createElement("option", null, "Technical SEO"), /*#__PURE__*/React.createElement("option", null, "Agentic Systems")), /*#__PURE__*/React.createElement("optgroup", {
    label: "Business Services"
  }, /*#__PURE__*/React.createElement("option", null, "Cost Reduction"), /*#__PURE__*/React.createElement("option", null, "Lead Generation"), /*#__PURE__*/React.createElement("option", null, "Growth Marketing"), /*#__PURE__*/React.createElement("option", null, "Process Re-engineering")), /*#__PURE__*/React.createElement("option", null, "Something else"))), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    variant: "accent",
    block: true,
    size: "lg",
    rightIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 18
    })
  }, "Send"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: '12px',
      color: 'var(--blue-100)',
      textAlign: 'center'
    }
  }, "No obligation. We never share your personal information.")));
  if (inline) return panel;
  return /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 60,
      background: 'rgba(0,19,43,0.55)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }
  }, panel);
}
Object.assign(window, {
  ContactUs
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/ContactUs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/Footer.jsx
try { (() => {
function Footer() {
  const cols = [{
    h: 'TECHNICAL SERVICES',
    items: ['Web Development', 'Web Hosting', 'Technical SEO', 'Agentic Systems']
  }, {
    h: 'BUSINESS SERVICES',
    items: ['Cost Reduction', 'Lead Generation', 'Growth Marketing', 'Process Re-engineering']
  }, {
    h: 'Company',
    items: ['About Us', 'Contact']
  }];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--blue-900)',
      color: 'var(--blue-200)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-2xl)',
      margin: '0 auto',
      padding: '56px 24px 28px',
      display: 'grid',
      gridTemplateColumns: '1.4fr repeat(3, 1fr)',
      gap: '32px'
    },
    className: "an-footer-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Logo, {
    light: true
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '14px',
      lineHeight: 1.6,
      maxWidth: '30ch',
      marginTop: '16px',
      color: 'var(--blue-300)'
    }
  }, "Enterprise-grade services", /*#__PURE__*/React.createElement("br", null), "at small business prices"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '10px',
      marginTop: '18px'
    }
  }, ['linkedin', 'twitter', 'github'].map(s => /*#__PURE__*/React.createElement("a", {
    key: s,
    href: '#' + s,
    "aria-label": s,
    style: {
      width: '34px',
      height: '34px',
      borderRadius: '8px',
      border: '1px solid var(--blue-700)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--blue-200)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: s,
    size: 16
  }))))), cols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.h
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: '11px',
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--gold-400)',
      marginBottom: '14px'
    }
  }, c.h), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }
  }, c.items.map(i => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement("a", {
    href: '#' + i.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    style: {
      fontSize: '14px',
      color: 'var(--blue-200)',
      textDecoration: 'none'
    },
    onMouseEnter: e => e.currentTarget.style.color = '#FFF',
    onMouseLeave: e => e.currentTarget.style.color = 'var(--blue-200)'
  }, i))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--blue-800)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-2xl)',
      margin: '0 auto',
      padding: '18px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '10px',
      fontSize: '13px',
      color: 'var(--blue-400)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Andexor Network, Inc. All rights reserved."), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: '20px'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#privacy",
    style: {
      color: 'var(--blue-400)',
      textDecoration: 'none'
    }
  }, "Privacy"), /*#__PURE__*/React.createElement("a", {
    href: "#terms",
    style: {
      color: 'var(--blue-400)',
      textDecoration: 'none'
    }
  }, "Terms")))));
}
Object.assign(window, {
  Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/Header.jsx
try { (() => {
const {
  Button
} = window.AndexorNetworkDesignSystem_d67969;
function Header({
  onProposal
}) {
  const [open, setOpen] = React.useState(false);
  const nav = ['Services', 'About Us'];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 30,
      background: 'linear-gradient(90deg, #475569, #28211A)',
      backdropFilter: 'saturate(140%) blur(10px)',
      WebkitBackdropFilter: 'saturate(140%) blur(10px)',
      borderBottom: '1px solid rgba(255,255,255,0.14)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-2xl)',
      margin: '0 auto',
      padding: '0 24px',
      height: '68px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    light: true
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '28px'
    },
    className: "an-desktop-nav"
  }, nav.map(n => /*#__PURE__*/React.createElement("a", {
    key: n,
    href: '#' + n.toLowerCase(),
    style: {
      fontSize: '14px',
      fontWeight: 500,
      color: 'rgba(255,255,255,0.85)',
      textDecoration: 'none'
    },
    onMouseEnter: e => e.currentTarget.style.color = '#FFF',
    onMouseLeave: e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'
  }, n))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "sm",
    rightIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 15
    }),
    onClick: onProposal
  }, "Contact Us"))));
}
Object.assign(window, {
  Header
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/Hero.jsx
try { (() => {
const {
  Button
} = window.AndexorNetworkDesignSystem_d67969;
function Hero({
  onProposal
}) {
  return /*#__PURE__*/React.createElement("section", {
    id: "top",
    style: {
      position: 'relative',
      background: 'var(--surface-ink)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      opacity: 0.5,
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
      backgroundSize: '48px 48px',
      maskImage: 'radial-gradient(ellipse 80% 70% at 70% 0%, #000 30%, transparent 75%)',
      WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 70% 0%, #000 30%, transparent 75%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 'var(--container-2xl)',
      margin: '0 auto',
      padding: '29px 24px 29px'
    },
    className: "an-hero-grid"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: '22px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      left: '-150px',
      top: '50%',
      width: '420px',
      height: '420px',
      transform: 'translateY(-50%)',
      background: 'radial-gradient(circle, color-mix(in srgb, var(--gold-500) 12%, transparent), transparent 48%)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: window.__resources && window.__resources.logoGold || "../../assets/logo/logo-gold.svg",
    alt: "",
    style: {
      position: 'relative',
      width: 'clamp(72px, 9vw, 112px)',
      height: 'clamp(72px, 9vw, 112px)',
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'clamp(32px, 4.4vw, 54px)',
      lineHeight: 1,
      letterSpacing: '-0.02em',
      color: '#FFF'
    }
  }, "Andexor Network")), /*#__PURE__*/React.createElement("h1", {
    style: {
      position: 'relative',
      color: '#FFF',
      fontSize: 'clamp(38px, 5vw, 60px)',
      lineHeight: 1.04,
      letterSpacing: '-0.02em',
      margin: '40px 0 0',
      maxWidth: '14em',
      textWrap: 'balance'
    }
  }, "Enterprise-grade services at small business prices"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--blue-200)',
      fontSize: '19px',
      lineHeight: 1.55,
      maxWidth: '22em',
      margin: '20px 0 0'
    }
  }, "We create and manage solutions to help your business grow."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '12px',
      marginTop: '30px',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "lg",
    rightIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 18
    }),
    onClick: onProposal
  }, "Contact Us"))));
}
Object.assign(window, {
  Hero
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/Icon.jsx
try { (() => {
/* Lucide icon → inline SVG. Reads icon node data from the Lucide UMD global
   so icons render as real <svg> inside React without DOM-scanning. */
function toPascal(name) {
  return name.replace(/(^\w|-\w)/g, s => s.replace('-', '').toUpperCase());
}
function Icon({
  name,
  size = 20,
  stroke = 2,
  className = '',
  style
}) {
  const lib = window.lucide && (window.lucide.icons || window.lucide) || {};
  const node = lib[toPascal(name)] || lib[name];
  // Lucide UMD icon node = ["svg", attrs, [ [tag, attrs], ... ] ]; children live at node[2].
  const children = Array.isArray(node) ? Array.isArray(node[2]) ? node[2] : [] : [];
  const inner = children.map(([tag, attrs]) => `<${tag} ${Object.entries(attrs || {}).map(([k, v]) => `${k}="${v}"`).join(' ')} />`).join('');
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: className,
    style: {
      display: 'block',
      flex: 'none',
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: inner
    }
  });
}

/* Brand logo lockup used in header + footer. */
function Logo({
  light = false,
  compact = false
}) {
  return /*#__PURE__*/React.createElement("a", {
    href: "#top",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '11px',
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: window.__resources && window.__resources.logoGold || "../../assets/logo/logo-gold.svg",
    alt: "Andexor Network",
    style: {
      width: '38px',
      height: '38px'
    }
  }), !compact && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      lineHeight: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: '19px',
      letterSpacing: '-0.02em',
      color: light ? '#FFF' : 'var(--text-heading)'
    }
  }, "Andexor"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: '9px',
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: light ? 'var(--gold-400)' : 'var(--text-accent)',
      marginTop: '3px'
    }
  }, "Network, Inc.")));
}
Object.assign(window, {
  Icon,
  Logo
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/Icon.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/Results.jsx
try { (() => {
const {
  Stat,
  Badge
} = window.AndexorNetworkDesignSystem_d67969;
function Results() {
  const stats = [{
    v: '+182%',
    l: 'Avg. organic traffic'
  }, {
    v: '3.1×',
    l: 'Pipeline ROI'
  }, {
    v: '0.9s',
    l: 'Median LCP'
  }, {
    v: '40+',
    l: 'Industries served'
  }];
  const logos = ['NORTHWIND', 'BRIGHTLEAF', 'Carta&Co', 'MERIDIAN', 'Oakline', 'VANTA GROUP'];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-ink)',
      color: '#FFF'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-2xl)',
      margin: '0 auto',
      padding: 'var(--section-y) 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      flexWrap: 'wrap',
      gap: '20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: '520px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: '12px',
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--gold-400)'
    }
  }, ">> Outcomes"), /*#__PURE__*/React.createElement("h2", {
    style: {
      color: '#FFF',
      fontSize: 'clamp(30px,3.6vw,42px)',
      letterSpacing: '-0.02em',
      margin: '12px 0 0'
    }
  }, "Results we report on, not around")), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--blue-200)',
      maxWidth: '34ch',
      fontSize: '15px',
      lineHeight: 1.6,
      margin: 0
    }
  }, "Median figures across active engagements in the trailing 12 months.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))',
      gap: '24px',
      marginTop: '48px',
      borderTop: '1px solid var(--blue-700)',
      borderBottom: '1px solid var(--blue-700)',
      padding: '40px 0'
    }
  }, stats.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.l
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'clamp(36px,4vw,52px)',
      color: '#FFF',
      letterSpacing: '-0.02em',
      lineHeight: 1
    }
  }, s.v), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: '12px',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--gold-400)',
      marginTop: '10px'
    }
  }, s.l)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      marginTop: '40px',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '12px',
      color: 'var(--blue-300)',
      fontFamily: 'var(--font-mono)',
      letterSpacing: '0.08em'
    }
  }, "TRUSTED BY"), logos.map(l => /*#__PURE__*/React.createElement("span", {
    key: l,
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: '16px',
      color: 'var(--blue-200)',
      opacity: 0.8,
      letterSpacing: '0.02em'
    }
  }, l)))));
}
Object.assign(window, {
  Results
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/Results.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/Services.jsx
try { (() => {
const {
  Card,
  Badge
} = window.AndexorNetworkDesignSystem_d67969;
const SERVICES = [{
  icon: 'code-2',
  tag: 'Web',
  tone: 'brand',
  title: 'Web Development',
  body: "We'll create or update your site with a strong technical foundation to handle an increase in traffic and sales.",
  points: ['Brochure site, blog, forms, shop', 'Content management system', 'Web application']
}, {
  icon: 'search',
  tag: 'SEO',
  tone: 'accent',
  title: 'Technical SEO',
  body: "We'll assess your site's structure and brand identity, then improve visibility in search engines and AI agents.",
  points: ['Site audit', 'Content strategy', 'Maps, social media']
}, {
  icon: 'bot',
  tag: 'AI',
  tone: 'brand',
  title: 'Agentic Systems',
  body: "We'll build the agents you need so you can adapt to emerging trends as AI agents handle business transactions.",
  points: ['Knowledge Base', 'Digital assistant, scheduling', 'Workflow automation']
}, {
  icon: 'line-chart',
  tag: 'Growth',
  tone: 'accent',
  title: 'Growth Marketing',
  body: 'Campaigns made for impact, from brand awareness to lead generation to closed sales, with continuous monitoring.',
  points: ['Newsletters, branded email', 'Social media marketing', 'Paid advertising']
}];
function Services() {
  return /*#__PURE__*/React.createElement("section", {
    id: "services",
    style: {
      padding: 'var(--section-y) 24px',
      maxWidth: 'var(--container-2xl)',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: '620px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'clamp(30px,3.6vw,42px)',
      letterSpacing: '-0.02em',
      margin: '12px 0 0'
    }
  }, "Four disciplines, all in one place"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '18px',
      color: 'var(--text-body)',
      margin: '14px 0 0',
      lineHeight: 1.55
    }
  }, "Web, SEO, AI, and marketing under one roof.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '18px',
      marginTop: '40px'
    }
  }, SERVICES.map(s => /*#__PURE__*/React.createElement(Card, {
    key: s.title,
    hover: true,
    as: "a",
    href: '#' + s.tag.toLowerCase(),
    style: {
      textDecoration: 'none',
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: '44px',
      height: '44px',
      borderRadius: '11px',
      background: 'var(--blue-50)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--blue-700)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: s.icon,
    size: 22
  })), /*#__PURE__*/React.createElement(Badge, {
    tone: s.tone
  }, s.tag)), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '20px',
      margin: '0 0 6px',
      color: 'var(--text-heading)'
    }
  }, s.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '14px',
      color: 'var(--text-body)',
      lineHeight: 1.55,
      margin: '0 0 14px'
    }
  }, s.body), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '7px'
    }
  }, s.points.map(p => /*#__PURE__*/React.createElement("li", {
    key: p,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '13px',
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 15,
    style: {
      color: 'var(--gold-600)'
    }
  }), /*#__PURE__*/React.createElement("span", null, p))))))));
}
Object.assign(window, {
  Services
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/Services.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/Testimonial.jsx
try { (() => {
const {
  Card,
  Avatar,
  Button
} = window.AndexorNetworkDesignSystem_d67969;
function Testimonial() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 'var(--container-xl)',
      margin: '0 auto',
      padding: 'var(--section-y) 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr',
      gap: '28px',
      alignItems: 'stretch'
    },
    className: "an-quote-grid"
  }, /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Icon, {
    name: "quote",
    size: 34,
    style: {
      color: 'var(--gold-500)'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 'clamp(20px,2.4vw,28px)',
      lineHeight: 1.34,
      letterSpacing: '-0.01em',
      color: 'var(--text-heading)',
      margin: '18px 0 0'
    }
  }, "\"Andexor rebuilt our site, fixed years of SEO debt, and stood up an AI support flow in a single quarter. We finally have one team that owns the whole sales funnel.\"")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '13px',
      marginTop: '32px'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Ren\xE9e Caldwell",
    size: "lg"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      color: 'var(--text-heading)',
      fontSize: '15px'
    }
  }, "Ren\xE9e Caldwell"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '13px',
      color: 'var(--text-muted)'
    }
  }, "VP Marketing, Brightleaf Supply")))), /*#__PURE__*/React.createElement(Card, {
    ink: true,
    style: {
      padding: '36px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: '18px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: '12px',
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--gold-400)'
    }
  }, ">> The engagement"), [['Rebuilt', 'on Next.js + headless CMS'], ['Recovered', '2 years of crawl and index debt'], ['Launched', 'AI support deflecting 38% of tickets']].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 18,
    style: {
      color: 'var(--gold-400)',
      marginTop: '2px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#FFF',
      fontSize: '15px'
    }
  }, /*#__PURE__*/React.createElement("strong", null, k), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--blue-200)'
    }
  }, v)))), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onInk: true,
    rightIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 16
    }),
    style: {
      marginTop: '6px',
      alignSelf: 'flex-start'
    }
  }, "Read the case study"))));
}
Object.assign(window, {
  Testimonial
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/Testimonial.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/tweaks-panel.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).

/* BEGIN USAGE */
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
// Exports (to window): useTweaks, TweaksPanel, TweakSection, TweakRow, TweakSlider,
//   TweakToggle, TweakRadio, TweakSelect, TweakText, TweakNumber, TweakColor, TweakButton.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261B", "#F6F4EF"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261B', '#F6F4EF'],
//                                  ['#475569', '#0F172A', '#F1F5F9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// TweakRadio is the segmented control for 2–3 short options (auto-falls-back to
// TweakSelect past ~16/~10 chars per label); reach for TweakSelect directly when
// options are many or long. For color tweaks always curate 3-4 options rather than
// a free picker; an option can also be a whole 2–5 color palette (the stored value
// is the array). The Tweak* controls are a floor, not a ceiling — build custom
// controls inside the panel if a tweak calls for UI they don't cover.
/* END USAGE */
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261B;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261B}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#FFF;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#FFF;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34C759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#FFF;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#FFF;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : {
      [keyOrEdits]: val
    };
    setValues(prev => ({
      ...prev,
      ...edits
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits
    }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', {
      detail: edits
    }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({
  title = 'Tweaks',
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = e => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, __TWEAKS_STYLE), /*#__PURE__*/React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    "data-omelette-chrome": "",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement("button", {
    className: "twk-x",
    "aria-label": "Close tweaks",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "twk-body"
  }, children)));
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "twk-sect"
  }, label), children);
}
function TweakRow({
  label,
  value,
  children,
  inline = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: inline ? 'twk-row twk-row-h' : 'twk-row'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label), value != null && /*#__PURE__*/React.createElement("span", {
    className: "twk-val"
  }, value)), children);
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label,
    value: `${value}${unit}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakToggle({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "twk-toggle",
    "data-on": value ? '1' : '0',
    role: "switch",
    "aria-checked": !!value,
    onClick: () => onChange(!value)
  }, /*#__PURE__*/React.createElement("i", null)));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = o => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({
    2: 16,
    3: 10
  }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = s => {
      const m = options.find(o => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return /*#__PURE__*/React.createElement(TweakSelect, {
      label: label,
      value: value,
      options: options,
      onChange: s => onChange(resolve(s))
    });
  }
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;
  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = e => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = ev => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    role: "radiogroup",
    onPointerDown: onPointerDown,
    className: dragging ? 'twk-seg dragging' : 'twk-seg'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": o.value === value
  }, o.label))));
}
function TweakSelect({
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("select", {
    className: "twk-field",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })));
}
function TweakText({
  label,
  value,
  placeholder,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("input", {
    className: "twk-field",
    type: "text",
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakNumber({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) {
  const clamp = n => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({
    x: 0,
    val: 0
  });
  const onScrubStart = e => {
    e.preventDefault();
    startRef.current = {
      x: e.clientX,
      val: value
    };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = ev => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "twk-num-lbl",
    onPointerDown: onScrubStart
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: e => onChange(clamp(Number(e.target.value)))
  }), unit && /*#__PURE__*/React.createElement("span", {
    className: "twk-num-unit"
  }, unit));
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #FAFAFA without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, c => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = n >> 16 & 255,
    g = n >> 8 & 255,
    b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}
const __TwkCheck = ({
  light
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 14 14",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M3 7.2 5.8 10 11 4.2",
  fill: "none",
  strokeWidth: "2.2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  stroke: light ? 'rgba(0,0,0,.78)' : '#FFF'
}));

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({
  label,
  value,
  options,
  onChange
}) {
  if (!options || !options.length) {
    return /*#__PURE__*/React.createElement("div", {
      className: "twk-row twk-row-h"
    }, /*#__PURE__*/React.createElement("div", {
      className: "twk-lbl"
    }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("input", {
      type: "color",
      className: "twk-swatch",
      value: value,
      onChange: e => onChange(e.target.value)
    }));
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = o => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-chips",
    role: "radiogroup"
  }, options.map((o, i) => {
    const colors = Array.isArray(o) ? o : [o];
    const [hero, ...rest] = colors;
    const sup = rest.slice(0, 4);
    const on = key(o) === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      className: "twk-chip",
      role: "radio",
      "aria-checked": on,
      "data-on": on ? '1' : '0',
      "aria-label": colors.join(', '),
      title: colors.join(' · '),
      style: {
        background: hero
      },
      onClick: () => onChange(o)
    }, sup.length > 0 && /*#__PURE__*/React.createElement("span", null, sup.map((c, j) => /*#__PURE__*/React.createElement("i", {
      key: j,
      style: {
        background: c
      }
    }))), on && /*#__PURE__*/React.createElement(__TwkCheck, {
      light: __twkIsLight(hero)
    }));
  })));
}
function TweakButton({
  label,
  onClick,
  secondary = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: secondary ? 'twk-btn secondary' : 'twk-btn',
    onClick: onClick
  }, label);
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/tweaks-panel.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Stat = __ds_scope.Stat;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Switch = __ds_scope.Switch;

})();
