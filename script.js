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


    /*
     * 自動排除重複網址
     */

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


    /*
     * 超過 5 個變紅色
     */

    if (links.length > 5) {

        linkCount.style.color =
            "#d00000";

    } else {

        linkCount.style.color =
            "#333333";

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
   輸入網址
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


        /* 清除舊錯誤 */

        clearError();


        /* 隱藏舊結果 */

        result.style.display =
            "none";


        /* 取得網址 */

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
           檢查蝦皮網址
        ========================================== */

        const invalidLinks =
            links.filter(
                url => {

                    return !isShopeeUrl(
                        url
                    );

                }
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


        /*
         * =================================================
         *
         * 目前為「測試模式」
         *
         * 之後 API 完成後，
         * 只需要修改這裡。
         *
         * 流程：
         *
         * 使用者
         *     ↓
         * 5 個蝦皮網址
         *     ↓
         * Cloudflare Worker
         *     ↓
         * 蝦皮 API
         *     ↓
         * 回傳推廣連結
         *     ↓
         * 顯示結果
         *
         * =================================================
         */


        try {


            /*
             * 模擬 API 等待時間
             */

            await wait(800);


            /*
             * 暫時直接使用原網址
             *
             * 等 API 完成後替換
             */

            const convertedLinks =
                links.map(
                    url => url
                );


            /*
             * 顯示結果
             */

            showResults(
                convertedLinks
            );


        } catch (err) {


            console.error(
                err
            );


            showError(
                "轉換時發生錯誤，請稍後再試"
            );


        } finally {


            /*
             * 關閉 Loading
             */

            loading.style.display =
                "none";

        }

    }
);


/* ==================================================
   判斷是否為蝦皮網址
================================================== */

function isShopeeUrl(url) {

    try {

        const parsedUrl =
            new URL(url);


        /*
         * 目前允許：
         *
         * shopee.tw
         * www.shopee.tw
         */

        return (
            parsedUrl.hostname ===
                "shopee.tw"

            ||

            parsedUrl.hostname ===
                "www.shopee.tw"
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


    /* 清除舊結果 */

    result.innerHTML =
        "";


    /* ==========================================
       標題
    ========================================== */

    const title =
        document.createElement(
            "p"
        );


    title.className =
        "result-title";


    title.textContent =
        `已產生 ${links.length} 個連結`;


    result.appendChild(
        title
    );


    /* ==========================================
       建立每一個結果
    ========================================== */

    links.forEach(
        (url, index) => {


            /* 外層 */

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "resultItem";


            /* 網址 */

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


            /* 複製按鈕 */

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.textContent =
                "複製";


            /* ==================================
               單一複製
            ================================== */

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


                        button.textContent =
                            "請手動複製";

                    }

                }
            );


            /* 加入 */

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
       全部複製按鈕
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


    /* ==========================================
       全部複製
    ========================================== */

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


            } else {


                copyAllButton.textContent =
                    "複製失敗";

            }

        }
    );


    result.appendChild(
        copyAllButton
    );


    /* 顯示 */

    result.style.display =
        "block";

}


/* ==================================================
   複製文字
================================================== */

async function copyText(
    text
) {


    /*
     * 優先使用現代 Clipboard API
     */

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
            "Clipboard API 失敗，使用備用方式"
        );

    }


    /*
     * 備用複製方式
     */

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


        /* 清除輸入 */

        urlInput.value =
            "";


        /* 清除結果 */

        result.innerHTML =
            "";


        result.style.display =
            "none";


        /* 清除錯誤 */

        clearError();


        /* 清除數量 */

        linkCount.textContent =
            "0 / 5";


        linkCount.style.color =
            "#333333";

    }
);


/* ==================================================
   等待工具
================================================== */

function wait(
    milliseconds
) {

    return new Promise(
        resolve => {

            setTimeout(
                resolve,
                milliseconds
            );

        }
    );

}


/* ==================================================
   初始化
================================================== */

updateLinkCount();
