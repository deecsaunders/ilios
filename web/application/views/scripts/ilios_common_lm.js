ilios.namespace('common.lm');

ilios.common.lm.learningMaterialsDetailsDialog = null;
ilios.common.lm.learningMaterialsDetailsModel = null;

// @private
ilios.common.lm.buildLearningMaterialLightboxDOM = function () {
    var Event = YAHOO.util.Event;
    var element = null;

    var handleCancel = function () {
        this.cancel();
    };

    var doneStr = ilios_i18nVendor.getI18NString('general.terms.done');

/*
* There is a save modification case, when the LM author is the present authenticated user -- TODO

    var handleSave = function () {
        validateLightboxSave(this);
    };
    var saveStr = ilios_i18nVendor.getI18NString('general.terms.save');
    var buttonArray = [{text: saveStr, handler: handleSave, isDefault: true},
                       {text: doneStr, handler: handleCancel}];
*/

    var buttonArray = [{text: doneStr, handler: handleCancel}];

    var panelWidth = "620px";
    var dialog = new YAHOO.widget.Dialog('ilios_learning_material_lightbox',
                                         {width: panelWidth, modal: true, visible: false,
                                          constraintoviewport: false, buttons: buttonArray});
    var displayOnTriggerHandler = null;

    dialog.showDialogPane = function () {
        ilios.common.lm.populateLearningMaterialMetadataDialog(
                                        ilios.common.lm.learningMaterialsDetailsModel);

        dialog.center();
        dialog.show();
    };

    // Render the Dialog
    dialog.render();

    displayOnTriggerHandler = function (type, handlerArgs) {
        if (handlerArgs[0].action == 'lm_metadata_dialog_open') {
            dialog.cnumber = handlerArgs[0].container_number;

            dialog.showDialogPane();
        }
    };
    ilios.ui.onIliosEvent.subscribe(displayOnTriggerHandler);

    ilios.common.lm.learningMaterialsDetailsDialog = dialog;

    element = document.getElementById('ilios_lm_required_checkbox');
    Event.addListener(element, 'click', function (e) {
        var toggle = (! ilios.common.lm.learningMaterialsDetailsModel.isRequired());
        var containerNumber = ilios.common.lm.learningMaterialsDetailsDialog.cnumber;
        var model = null;

        if (containerNumber == -1) {
            model = ilios.cm.currentCourseModel;
        } else {
            model = ilios.cm.currentCourseModel.getSessionForContainer(containerNumber);
        }

        ilios.common.lm.learningMaterialsDetailsModel.setRequired(toggle);

        model.setDirtyAndNotify();
    });

    element = document.getElementById('ilios_lm_mesh_link');
    Event.addListener(element, 'click', function (e) {
        ilios.ui.onIliosEvent.fire({
            action: 'mesh_picker_dialog_open',
            model_in_edit: ilios.common.lm.learningMaterialsDetailsModel
        });
        return false;
    });

    element = document.getElementById('ilios_lm_notes_link');
    Event.addListener(element, 'click', function (e) {
        ilios.ui.onIliosEvent.fire({
            action: 'elmn_dialog_open'
        });
        return false;
    });
};

YAHOO.util.Event.onDOMReady(ilios.common.lm.buildLearningMaterialLightboxDOM);

