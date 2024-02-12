// GLOBALS

const API_BASE = 'https://api.rogerapp.it';
// const API_BASE = 'https://api.roger.work';
const BASE_URI = $('head base').attr('href');

const flatpickrConfig = {
    locale: "it",
    altInput: true,
    altFormat: 'd-m-Y',
    dateFormat: 'Y-m-d',
    allowInput: true
}

const idFileTypes = ['application/pdf',
    'image/jpeg', 'image/png'];

const photoFileTypes = ['image/jpeg', 'image/png'];

var template = jQuery.validator.format("");

var formCode = null;

// DATA BINDING

// Declare a global object to store view data.
var viewData;
var children = [];
var childrenNumber = 1;
var stepper;

var request = {
    documents: [],
    children: []
};

viewData = {};

$(function () {
    // Update the viewData object with the current field keys and values.
    function updateViewData(key, value) {
        viewData[key] = value;
    }
    // Register all bindable elements
    function detectBindableElements() {
        var bindableEls;
        bindableEls = $('[data-bind]');
        // Add event handlers to update viewData and trigger callback event.
        bindableEls.on('change', function () {
            var $this;
            $this = $(this);
            updateViewData($this.data('bind'), $this.val());
            $(document).trigger('updateDisplay');
        });
        // Add a reference to each bindable element in viewData.
        bindableEls.each(function () {
            updateViewData($(this));
        });
    }
    // Trigger this event to manually update the list of bindable elements, useful when dynamically loading form fields.
    $(document).on('updateBindableElements', detectBindableElements);
    detectBindableElements();
});

$(function () {
    // An example of how the viewData can be used by other functions.
    function updateDisplay() {
        var updateEls;
        updateEls = $('[data-update]');
        updateEls.each(function () {
            $(this).html(viewData[$(this).data('update')]);
        });
    }
    // Run updateDisplay on the callback.
    $(document).on('updateDisplay', updateDisplay);
});


$(function () { // jQuery ready
    // On blur validation listener for form elements
    $('.needs-validation').find('input,select,textarea').on('focusout', function () {
        // check element validity and change class
        $(this).removeClass('is-valid is-invalid')
            .addClass(this.checkValidity() ? 'is-valid' : 'is-invalid');
    });
});

var renderSteps = function () {
    $('.bs-stepper-header').empty();
    $.get(`${BASE_URI}/html/dati-genitore-header.html`, function (data) {
        $('.bs-stepper-header').append(data);
        $.get(`${BASE_URI}/html/dati-ragazzi-header.html`, function (data) {
            $('.bs-stepper-header').append(data);
            $.get(`${BASE_URI}/html/riepilogo-header.html`, function (data) {
                $('.bs-stepper-header').append(data);
                stepper = new Stepper($('.bs-stepper')[0]);
            });
        });
    });
}

$().ready(function () {
    renderSteps();
})

$(window).bind('beforeunload', function () {
    return 'Sei sicuro di voler abbandonare?'
});