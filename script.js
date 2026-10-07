/* ==================================================
   Cloudflare Worker API
================================================== */

const WORKER_API =
    "https://shopee-affiliate-api.jerry990618.workers.dev";


/* ==================================================
   取得 HTML 元件
================================================== */

const convertBtn =
    document.getElementById("convertBtn");

const clearBtn =
    document.getElementById("clearBtn");

const urlInput =
    document.getElementById("urlInput");

const result =
    document.getElementById("result");

const loading =
    document.getElementById("loading");

const error =
    document.getElementById("error");

const linkCount =
    document.getElementById("linkCount");


/* ==================================================
   取得網址列表
================================================== */

function getLinks() {

    const links =
        urlInput.value
            .split(/\r?\n/)
            .map(
                url => url.trim()
            )
            .filter(
                url => url !== ""
            );

    // 自動排除重複網址
    return [
        ...new Set(links)
    ];
}


/* ==================================================
   更新網址數量
================================================== */

function updateLinkCount() {

    const links =
        getLinks();

    linkCount.textContent =
        `${links.length} / 5`;


    if (links.length > 5) {

        linkCount.style.background =
            "#fff0ed";

        linkCount.style.color =
            "#d33c24";

    } else {

        linkCount.style.background =
            "#eef5ff";

        linkCount.style.color =
            "#2463a6";
    }
}


/* ==================================================
   顯示錯誤
================================================== */

function showError(message) {

    error.textContent =
        message;

    error.style.display =
        "block";
}


/* ==================================================
   清除錯誤
================================================== */

function clearError() {

    error.textContent =
        "";

    error.style.display =
        "none";
}


/* ==================================================
   使用者輸入
================================================== */

urlInput.addEventListener(
    "input",
    () => {

        updateLinkCount();

        clearError();
    }
);


/* ==================================================
   產生推廣連結
================================================== */

convertBtn.addEventListener(
    "click",
    async () => {

        clearError();

        result.style.display =
            "none";


        const links =
            getLinks();


        /* ==========================================
           沒有網址
        ========================================== */

        if (links.length === 0) {

            showError(
                "請至少貼上一個蝦皮商品網址"
            );

            return;
        }


        /* ==========================================
           超過 5 個
        ========================================== */

        if (links.length > 5) {

            showError(
                "一次最多只能貼 5 個網址"
            );

            return;
        }


        /* ==========================================
           檢查網址
        ========================================== */

        const invalidLinks =
            links.filter(
                url =>
                    !isShopeeUrl(url)
            );


        if (
            invalidLinks.length > 0
        ) {

            showError(
                "其中有不是蝦皮的網址，請檢查後再試"
            );

            return;
        }


        /* ==========================================
           顯示 Loading
        ========================================== */

        loading.style.display =
            "flex";


        try {

            /* ======================================
               呼叫 Cloudflare Worker
            ====================================== */

            const response =
                await fetch(
                    WORKER_API,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            urls: links
                        })
                    }
                );


            /* ======================================
               取得 API 回應
            ====================================== */

            const data =
                await response.json();


            /* ======================================
               API 發生錯誤
            ====================================== */

            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.error ||
                    "轉換失敗"
                );
            }


            /* ======================================
               確認回傳資料
            ====================================== */

            if (
                !Array.isArray(
                    data.results
                )
            ) {

                throw new Error(
                    "API 回傳資料格式錯誤"
                );
            }


            /* ======================================
               取得轉換後的短連結
            ====================================== */

            const convertedLinks =
                data.results.map(
                    item =>
                        item.shortLink
                );


            /* ======================================
               顯示結果
            ====================================== */

            showResults(
                convertedLinks
            );


        } catch (err) {

            console.error(err);

            showError(
                err.message ||
                "轉換時發生錯誤，請稍後再試"
            );


        } finally {

            loading.style.display =
                "none";
        }

    }
);


/* ==================================================
   判斷蝦皮網址
================================================== */

function isShopeeUrl(url) {

    try {

        const parsedUrl =
            new URL(url);

        const hostname =
            parsedUrl.hostname
                .toLowerCase();


        return (

            hostname ===
                "shopee.tw"

            ||

            hostname ===
                "www.shopee.tw"

            ||

            hostname ===
                "s.shopee.tw"

            ||

            hostname ===
                "tw.shp.ee"

        );

    } catch (error) {

        return false;
    }
}


/* ==================================================
   顯示結果
================================================== */

function showResults(
    links
) {

    result.innerHTML =
        "";


    /* ==========================================
       結果標題
    ========================================== */

    const title =
        document.createElement(
            "p"
        );


    title.className =
        "result-title";


    title.textContent =
        `✓ 已產生 ${links.length} 個連結`;


    result.appendChild(
        title
    );


    /* ==========================================
       每一個連結
    ========================================== */

    links.forEach(
        url => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "resultItem";


            /* ==================================
               網址輸入框
            ================================== */

            const input =
                document.createElement(
                    "input"
                );


            input.type =
                "text";


            input.value =
                url;


            input.readOnly =
                true;


            /* ==================================
               複製按鈕
            ================================== */

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.textContent =
                "複製";


            button.addEventListener(
                "click",
                async () => {

                    const success =
                        await copyText(
                            url
                        );


                    if (success) {

                        button.textContent =
                            "已複製 ✓";


                        setTimeout(
                            () => {

                                button.textContent =
                                    "複製";

                            },
                            1500
                        );


                    } else {

                        input.focus();

                        input.select();
                    }

                }
            );


            item.appendChild(
                input
            );


            item.appendChild(
                button
            );


            result.appendChild(
                item
            );

        }
    );


    /* ==========================================
       全部複製
    ========================================== */

    const copyAllButton =
        document.createElement(
            "button"
        );


    copyAllButton.type =
        "button";


    copyAllButton.className =
        "copyAll";


    copyAllButton.textContent =
        "全部複製";


    copyAllButton.addEventListener(
        "click",
        async () => {

            const allLinks =
                links.join("\n");


            const success =
                await copyText(
                    allLinks
                );


            if (success) {

                copyAllButton.textContent =
                    "全部已複製 ✓";


                setTimeout(
                    () => {

                        copyAllButton.textContent =
                            "全部複製";

                    },
                    1500
                );
            }

        }
    );


    result.appendChild(
        copyAllButton
    );


    result.style.display =
        "block";
}


/* ==================================================
   複製文字
================================================== */

async function copyText(
    text
) {

    /* ==========================================
       現代瀏覽器
    ========================================== */

    try {

        if (
            navigator.clipboard
            &&
            window.isSecureContext
        ) {

            await navigator
                .clipboard
                .writeText(
                    text
                );


            return true;
        }

    } catch (error) {

        console.log(
            "Clipboard API failed"
        );
    }


    /* ==========================================
       備用方法
    ========================================== */

    try {

        const textarea =
            document.createElement(
                "textarea"
            );


        textarea.value =
            text;


        textarea.style.position =
            "fixed";


        textarea.style.opacity =
            "0";


        document.body.appendChild(
            textarea
        );


        textarea.focus();

        textarea.select();


        const success =
            document.execCommand(
                "copy"
            );


        textarea.remove();


        return success;


    } catch (error) {

        return false;
    }
}


/* ==================================================
   清除
================================================== */

clearBtn.addEventListener(
    "click",
    () => {

        urlInput.value =
            "";


        result.innerHTML =
            "";


        result.style.display =
            "none";


        clearError();


        updateLinkCount();
    }
);


/* ==================================================
   初始化
================================================== */

updateLinkCount();
