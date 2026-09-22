/* =========================
   取得 HTML 元件
========================= */

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


/* =========================
   取得網址列表
========================= */

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


/* =========================
   更新網址數量
========================= */

function updateLinkCount() {

    const links =
        getLinks();


    linkCount.textContent =
        `${links.length} / 5`;


    /*
     * 超過 5 個時變成紅色
     */

    if (links.length > 5) {

        linkCount.style.color =
            "#d00000";

    } else {

        linkCount.style.color =
            "#333";

    }

}


/* =========================
   顯示錯誤
========================= */

function showError(message) {

    error.textContent =
        message;

    error.style.display =
        "block";

}


/* =========================
   清除錯誤
========================= */

function clearError() {

    error.textContent =
        "";

    error.style.display =
        "none";

}


/* =========================
   輸入網址時
========================= */

urlInput.addEventListener(
    "input",
    () => {

        updateLinkCount();

        clearError();

    }
);


/* =========================
   產生推廣連結
========================= */

convertBtn.addEventListener(
    "click",
    async () => {

        clearError();

        result.style.display =
            "none";


        /*
         * 取得所有網址
         */

        const links =
            getLinks();


        /* =====================
           沒有網址
        ===================== */

        if (links.length === 0) {

            showError(
                "請至少貼上一個蝦皮商品網址"
            );

            return;

        }


        /* =====================
           超過 5 個
        ===================== */

        if (links.length > 5) {

            showError(
                "一次最多只能貼 5 個網址"
            );

            return;

        }


        /* =====================
           檢查蝦皮網址
        ===================== */

        const invalidLinks =
            links.filter(
                url => {

                    return !(
                        url.includes(
                            "shopee.tw"
                        )
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


        /* =====================
           顯示 Loading
        ===================== */

        loading.style.display =
            "flex";


        /*
         * =====================================
         *
         * 目前這裡只是「測試版本」
         *
         * 未來 API 完成後，
         * 這裡會改成：
         *
         * links
         *   ↓
         * Cloudflare Worker
         *   ↓
         * 蝦皮 API
         *   ↓
         * 推廣連結
         *
         * =====================================
         */


        try {

            /*
             * 暫時等待 800 毫秒，
             * 模擬 API 回應
             */

            await wait(800);


            /*
             * 暫時直接把原網址
             * 當成轉換結果
             */

            showResults(
                links
            );


        } catch (err) {

            showError(
                "轉換時發生錯誤，請稍後再試"
            );

        } finally {

            loading.style.display =
                "none";

        }

    }
);


/* =========================
   顯示轉換結果
========================= */

function showResults(
    links
) {

    /*
     * 清空舊結果
     */

    result.innerHTML =
        "";


    /*
     * 標題
     */

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


    /*
     * 建立每一個結果
     */

    links.forEach(
        (url, index) => {

            /*
             * 外層
             */

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "resultItem";


            /*
             * 網址輸入框
             */

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


            /*
             * 複製按鈕
             */

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.textContent =
                "複製";


            /*
             * 複製功能
             */

            button.addEventListener(
                "click",
                async () => {

                    try {

                        await navigator
                            .clipboard
                            .writeText(
                                url
                            );


                        button.textContent =
                            "已複製 ✓";


                        setTimeout(
                            () => {

                                button.textContent =
                                    "複製";

                            },
                            1500
                        );


                    } catch (err) {

                        /*
                         * 如果瀏覽器禁止
                         * clipboard API，
                         * 就選取文字
                         */

                        input.select();

                        document.execCommand(
                            "copy"
                        );


                        button.textContent =
                            "已複製 ✓";


                        setTimeout(
                            () => {

                                button.textContent =
                                    "複製";

                            },
                            1500
                        );

                    }

                }
            );


            /*
             * 加入畫面
             */

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


    /*
     * =========================
     * 全部複製
     * =========================
     */

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

            try {

                await navigator
                    .clipboard
                    .writeText(
                        links.join("\n")
                    );


                copyAllButton.textContent =
                    "全部已複製 ✓";


                setTimeout(
                    () => {

                        copyAllButton.textContent =
                            "全部複製";

                    },
                    1500
                );


            } catch (err) {

                /*
                 * 備用複製方式
                 */

                const temp =
                    document.createElement(
                        "textarea"
                    );


                temp.value =
                    links.join("\n");


                document.body.appendChild(
                    temp
                );


                temp.select();


                document.execCommand(
                    "copy"
                );


                temp.remove();


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


    /*
     * 顯示結果
     */

    result.style.display =
        "block";

}


/* =========================
   清除
========================= */

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


        linkCount.textContent =
            "0 / 5";


        linkCount.style.color =
            "#333";

    }
);


/* =========================
   延遲工具
========================= */

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


/* =========================
   初始化
========================= */

updateLinkCount();
