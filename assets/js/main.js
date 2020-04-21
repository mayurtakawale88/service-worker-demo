$( document ).ready(function() {
    $(".pixel").click(function(ele) {
        const pixel = {
            interaction: "UserClick",
            client: "",
            os_name: getOSName(),
            x1: "",
            x2: "",
            x3: "",
            landing_url: ""
        };
        const keys = Object.keys(pixel);
        let queryParam = '';
        for (const key of keys) {
            if ($(this).attr(key)) {
                pixel[key] = $(this).attr(key);
            }
            if (!queryParam) {
                queryParam += key + '=' + pixel[key];
            } else {
                queryParam += '&' + key + '=' + pixel[key];
            }
        }
        $.get(`/pixel.gif?${queryParam}`);
    });

    function getOSName() {
        try {
            let OSName = "Unknown";
            if (window.navigator.userAgent.indexOf("Windows NT 10.0")!= -1) OSName="Windows 10";
            if (window.navigator.userAgent.indexOf("Windows NT 6.2") != -1) OSName="Windows 8";
            if (window.navigator.userAgent.indexOf("Windows NT 6.1") != -1) OSName="Windows 7";
            if (window.navigator.userAgent.indexOf("Windows NT 6.0") != -1) OSName="Windows Vista";
            if (window.navigator.userAgent.indexOf("Windows NT 5.1") != -1) OSName="Windows XP";
            if (window.navigator.userAgent.indexOf("Windows NT 5.0") != -1) OSName="Windows 2000";
            if (window.navigator.userAgent.indexOf("Mac")            != -1) OSName="Mac/iOS";
            if (window.navigator.userAgent.indexOf("X11")            != -1) OSName="UNIX";
            if (window.navigator.userAgent.indexOf("Linux")          != -1) OSName="Linux";
            return OSName;
        } catch (error) {
            return "";
        }
    }
});