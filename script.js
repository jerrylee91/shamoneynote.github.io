const convertBtn =
    document.getElementById("convertBtn");

const clearBtn =
    document.getElementById("clearBtn");

const urlInput =
    document.getElementById("urlInput");

const result =
    document.getElementById("result");

const resultUrl =
    document.getElementById("resultUrl");

const copyBtn =
    document.getElementById("copyBtn");

const loading =
    document.getElementById("loading");

const error =
    document.getElementById("error");


/* 產生連結 */

convertBtn.addEventListener(
    "click",
    async () => {

        const url =
            urlInput.value.trim();


        error.textContent = "";

        result.style.display = "none";


        /* 檢查是否輸入 */

        if (!url) {

            error.textContent =
                "請先貼上蝦皮商品網址";

            return;
        }


        /* 檢查是不是蝦皮網址 */

        if (!url.includes("shopee.tw")) {

            error.textContent =
                "請輸入有效的蝦皮網址";

            return;
        }


        /*
         * 目前只是測試網站
         *
         * 等 API 完成後
         * 這裡再接蝦皮 API
         */


        loading.style.display =
            "block";


        setTimeout(() => {

            loading.style.display =
                "none";


            resultUrl.value = url;


            result.style.display =
                "block";


        }, 800);

    }
);


/* 清除 */

clearBtn.addEventListener(
    "click",
    () => {

        urlInput.value = "";

        resultUrl.value = "";

        result.style.display =
            "none";

        error.textContent = "";

    }
);


/* 複製 */

copyBtn.addEventListener(
    "click",
    async () => {

        await navigator.clipboard.writeText(
            resultUrl.value
        );


        copyBtn.textContent =
            "已複製 ✓";


        setTimeout(() => {

            copyBtn.textContent =
                "複製";

        }, 1500);

    }
);
