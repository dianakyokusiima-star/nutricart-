(function(){function s(){const t=window.location.hostname,o=[];try{t.includes("instacart.com")?document.querySelectorAll('[data-testid="product"]').forEach(e=>{var r;const n=e.querySelector('[data-testid="product-name"]'),a=e.querySelector('[data-testid="product-price"]');n!=null&&n.textContent&&o.push({name:n.textContent.trim(),price:(r=a==null?void 0:a.textContent)==null?void 0:r.trim(),element:e})}):t.includes("amazon.com")?document.querySelectorAll('[data-component-type="s-search-result"]').forEach(e=>{var r;const n=e.querySelector("h2 a span"),a=e.querySelector(".a-price");n!=null&&n.textContent&&o.push({name:n.textContent.trim(),price:(r=a==null?void 0:a.textContent)==null?void 0:r.trim(),element:e})}):t.includes("walmart.com")&&document.querySelectorAll("[data-item-id]").forEach(e=>{const n=e.querySelector('span[data-automation-id="product-name"]');n!=null&&n.textContent&&o.push({name:n.textContent.trim(),element:e})})}catch{}return o}function l(t,o){const e=t.element.querySelector(".nutricart-overlay");e==null||e.remove();const n=document.createElement("div");n.className="nutricart-overlay",n.style.cssText=`
    margin-top: 8px;
    position: relative;
    z-index: 9999;
  `;const a=n.attachShadow({mode:"closed"}),r=document.createElement("style");r.textContent=d(),a.appendChild(r);const i=document.createElement("div");i.className="nc-overlay-card",i.innerHTML=p(o),a.appendChild(i),t.element.appendChild(n)}function d(){return`
    :host {
      --nc-green-500: #2D9F6E;
      --nc-rating-excellent: #2D9F6E;
      --nc-rating-good: #6ABF4B;
      --nc-rating-average: #F5A623;
      --nc-rating-poor: #E8863B;
      --nc-rating-bad: #E04848;
      --nc-up-bg: #FFF3E0;
      --nc-up-border: #FFB74D;
      --nc-up-text: #E65100;
      --nc-up-icon: #F57C00;
      --nc-white: #FFFFFF;
      --nc-gray-50: #F9FAFB;
      --nc-gray-100: #F3F4F6;
      --nc-gray-200: #E5E7EB;
      --nc-gray-300: #D1D5DB;
      --nc-gray-500: #6B7280;
      --nc-gray-700: #374151;
      --nc-gray-900: #111827;
      --nc-shadow-overlay: 0 8px 32px rgba(0,0,0,0.16);
    }

    .nc-overlay-card {
      font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--nc-white);
      border-radius: 8px;
      box-shadow: var(--nc-shadow-overlay);
      border: 1px solid var(--nc-gray-200);
      overflow: hidden;
      max-width: 300px;
      font-size: 12px;
      line-height: 1.4;
    }

    .nc-rating-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
    }

    .nc-badge {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 14px;
      color: white;
      flex-shrink: 0;
      border: 2px solid white;
    }

    .nc-info {
      flex: 1;
      min-width: 0;
    }

    .nc-info-label {
      font-weight: 600;
      color: var(--nc-gray-900);
      font-size: 12px;
    }

    .nc-info-sub {
      color: var(--nc-gray-500);
      font-size: 11px;
      margin-top: 1px;
    }

    .nc-bar {
      height: 4px;
      border-radius: 2px;
      background: var(--nc-gray-200);
      margin-top: 4px;
      overflow: hidden;
    }

    .nc-bar-fill {
      height: 100%;
      border-radius: 2px;
      background: linear-gradient(90deg, #E04848 0%, #F5A623 50%, #2D9F6E 100%);
    }

    .nc-upf-row {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: var(--nc-up-bg);
      border-top: 1px solid var(--nc-up-border);
      font-size: 11px;
      font-weight: 600;
      color: var(--nc-up-text);
    }

    .nc-upf-icon {
      color: var(--nc-up-icon);
      font-size: 14px;
    }

    .nc-nutrition {
      padding: 8px 12px;
      border-top: 1px solid var(--nc-gray-200);
    }

    .nc-nutrition-row {
      display: flex;
      justify-content: space-between;
      padding: 3px 0;
      font-size: 11px;
    }

    .nc-nutrition-label {
      color: var(--nc-gray-500);
    }

    .nc-nutrition-value {
      font-weight: 600;
      color: var(--nc-gray-700);
    }

    .nc-nutrition-value.bad {
      color: var(--nc-rating-bad);
    }

    .nc-alt-section {
      padding: 8px 12px;
      border-top: 1px solid var(--nc-gray-200);
    }

    .nc-alt-title {
      font-size: 11px;
      font-weight: 600;
      color: var(--nc-gray-700);
      margin-bottom: 6px;
    }

    .nc-alt-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 0;
    }

    .nc-alt-name {
      flex: 1;
      font-size: 11px;
      font-weight: 500;
      color: var(--nc-gray-900);
    }

    .nc-alt-reason {
      font-size: 10px;
      color: var(--nc-gray-500);
    }

    .nc-alt-badge {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 10px;
      color: white;
      flex-shrink: 0;
    }
  `}function p(t){const o={A:"#2D9F6E",B:"#6ABF4B",C:"#F5A623",D:"#E8863B",F:"#E04848"};let n=`
    <div class="nc-rating-row">
      <div class="nc-badge" style="background:${o[t.rating.grade]||"#6B7280"}">${t.rating.grade}</div>
      <div class="nc-info">
        <div class="nc-info-label">${t.rating.label}</div>
        <div class="nc-info-sub">NutriScore: ${t.rating.score}/100</div>
        <div class="nc-bar">
          <div class="nc-bar-fill" style="width:${t.rating.score}%"></div>
        </div>
      </div>
    </div>
  `;t.isUltraProcessed&&(n+=`
      <div class="nc-upf-row">
        <span class="nc-upf-icon">⚠</span>
        Ultra-Processed Food Detected
        ${t.novaGroup?`<span style="margin-left:auto;background:var(--nc-up-icon);color:white;padding:1px 6px;border-radius:999px;font-size:9px;font-weight:700;">NOVA ${t.novaGroup}</span>`:""}
      </div>
    `);const{nutrition:a}=t;if(n+=`
    <div class="nc-nutrition">
      <div class="nc-nutrition-row">
        <span class="nc-nutrition-label">Calories</span>
        <span class="nc-nutrition-value">${a.calories}</span>
      </div>
      <div class="nc-nutrition-row">
        <span class="nc-nutrition-label">Sugar</span>
        <span class="nc-nutrition-value ${a.sugar>10?"bad":""}">${a.sugar}g</span>
      </div>
      <div class="nc-nutrition-row">
        <span class="nc-nutrition-label">Protein</span>
        <span class="nc-nutrition-value">${a.protein}g</span>
      </div>
    </div>
  `,t.alternatives&&t.alternatives.length>0){n+='<div class="nc-alt-section"><div class="nc-alt-title">🌱 Healthier Alternatives</div>';for(const r of t.alternatives){const i=o[r.rating.grade]||"#6B7280";n+=`
        <div class="nc-alt-item">
          <div style="flex:1;min-width:0;">
            <div class="nc-alt-name">${r.name}</div>
            <div class="nc-alt-reason">${r.reason}</div>
          </div>
          <div class="nc-alt-badge" style="background:${i}">${r.rating.grade}</div>
        </div>
      `}n+="</div>"}return n}async function c(){const t=s();for(const o of t)try{const e=await chrome.runtime.sendMessage({type:"PRODUCT_DETECTED",payload:{productName:o.name,brand:o.brand,url:window.location.href}});(e==null?void 0:e.type)==="PRODUCT_RATING"&&l(o,e.payload)}catch{}}c();function u(t,o){let e=0;return(...n)=>{const a=Date.now();if(a-e>=o)return e=a,t(...n)}}const g=u(c,500),v=new MutationObserver(()=>{g()});v.observe(document.body,{childList:!0,subtree:!0});console.log("🍏 NutriCart content script initialized");
})()
