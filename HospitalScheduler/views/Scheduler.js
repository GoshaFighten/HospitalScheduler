HospitalScheduler.Scheduler = function (params) {
    "use strict";
    var fileName = 'appointments.txt';   

    var array = ko.observableArray();

    var viewModel = {
        schedulerConfig: {
            dataSource: array,
            height: '100%',
            startDayHour: 7,
            endDayHour: 21,
            onAppointmentAdded: function () {
                SaveAppoinments();
            },
            onAppointmentDeleted: function () {
                SaveAppoinments();
            },
            onAppointmentUpdated: function () {
                SaveAppoinments();
            }
        }
    };
    function SaveAppoinments() {
        HospitalScheduler.fileSystem.root.getFile(fileName, { create: true }, GetFileEntryWriter, FileSystemFail);
    };
    function FileSystemFail(evt) {
        HospitalScheduler.showError('Error:' + evt.error.code.toString());
    };
    function GetFileEntryWriter(fileEntry) {
        fileEntry.createWriter(WriteFile, FileSystemFail);
    };
    function WriteFile(writer) {
        writer.onwrite = function (evt) {
            HospitalScheduler.showSuccess("Writing complete.");
        };
        writer.write(JSON.stringify(array()));
    };
    function ReadFile(file) {
        var reader = new FileReader();
        reader.onloadend = function (evt) {
            array(JSON.parse(evt.target.result));
            HospitalScheduler.showSuccess('Reading complete.');
        };
        reader.readAsText(file);
    };
    function GetFileEntryReader(fileEntry) {
        fileEntry.file(ReadFile, FileSystemFail);
    };

    HospitalScheduler.fileSystemReady.done(function () {
        if (HospitalScheduler.checkFileSystem()) {
            HospitalScheduler.fileSystem.root.getFile(fileName, { create: true }, GetFileEntryReader, FileSystemFail);
        };
    });    

    return viewModel;
};