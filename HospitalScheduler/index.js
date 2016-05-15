window.HospitalScheduler = window.HospitalScheduler || {};

$(function() {
    // Uncomment the line below to disable platform-specific look and feel and to use the Generic theme for all devices
    // DevExpress.devices.current({ platform: "generic" });
    // To customize the Generic theme, use the DevExtreme Theme Builder (http://js.devexpress.com/ThemeBuilder)
    // For details on how to use themes and the Theme Builder, refer to the http://js.devexpress.com/Documentation/Guide/#themes article

    HospitalScheduler.notify = function (message, type, displayTime) {
        var displayTime = displayTime ? displayTime : 3000;
        DevExpress.ui.notify(message, type, displayTime);
    };

    HospitalScheduler.showError = function (message, displayTime) {
        HospitalScheduler.notify(message, 'error', displayTime); 
    };

    HospitalScheduler.showSuccess = function (message, displayTime) {
        HospitalScheduler.notify(message, 'success', displayTime);
    };

    var d = $.Deferred();

    function gotFS(fileSystem) {
        HospitalScheduler.fileSystem = fileSystem;
        d.resolve();
    }

    function fail(evt) {
        HospitalScheduler.showError(evt.error.code);
        d.reject();
    }

    HospitalScheduler.checkFileSystem = function () {
        if (HospitalScheduler.fileSystem == null) {
            HospitalScheduler.showError('File system is not accessible');
            return false;
        }
        return true;
    };
    HospitalScheduler.fileSystemReady = d.promise();

    $(document).on("deviceready", function () {
        navigator.splashscreen.hide();
        if(window.devextremeaddon) {
            window.devextremeaddon.setup();
        }
        $(document).on("backbutton", function () {
            DevExpress.processHardwareBackButton();
        });
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    });

    function onNavigatingBack(e) {
        if (e.isHardwareButton && !HospitalScheduler.app.canBack()) {
            e.cancel = true;
            exitApp();
        }
    }

    function exitApp() {
        switch (DevExpress.devices.real().platform) {
            case "android":
                navigator.app.exitApp();
                break;
            case "win":
                window.external.Notify("DevExpress.ExitApp");
                break;
        }
    }


    HospitalScheduler.app = new DevExpress.framework.html.HtmlApplication({
        namespace: HospitalScheduler,
        layoutSet: DevExpress.framework.html.layoutSets[HospitalScheduler.config.layoutSet],
        navigation: HospitalScheduler.config.navigation,
        commandMapping: HospitalScheduler.config.commandMapping
    });
    HospitalScheduler.app.router.register(":view/:id", { view: "Scheduler", id: undefined });
    HospitalScheduler.app.on("navigatingBack", onNavigatingBack);
    HospitalScheduler.app.navigate();
});
