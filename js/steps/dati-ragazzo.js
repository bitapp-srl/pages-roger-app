
var initStep2 = function () {

    var file = null;
    var childCodeTmp = null;
    var validatingCF = false;

    const flatpickrConfig = {
        locale: "it",
        altInput: true,
        altFormat: 'd-m-Y',
        dateFormat: 'Y-m-d',
        allowInput: true,
        enable: [{
            from: '2007-01-01',
            to: '2014-12-31'
        }],
        defaultDate: '2007-01-01',
        onClose: function (selectedDates, dateStr, instance) {
            console.log(selectedDates);
        }
    };

    $('#child_sex').select2({
        language: 'it',
        width: '100%',
        minimumResultsForSearch: -1,
        placeholder: ''
    });

    $('#child_school_municipality').select2({
        language: 'it',
        width: '100%',
        placeholder: 'Scegli...',
        data: [],
        minimumInputLenght: 2,
        ajax: {
            url: API_BASE + '/municipalities',
            dataType: 'json',
            data: function (params) {
                return {
                    q: params.term, // search term
                    region: '08'
                };
            },
            processResults: function (data) {
                // Transforms the top-level key of the response object from 'items' to 'results'
                return {
                    results: data
                };
            }
        }
    });

    const datePicker = $("#child_birth_date").flatpickr(flatpickrConfig);

    $('input[type=radio][name=emission]').change(function () {
        viewData.emissionType = this.value;
        viewData.shipment = undefined;

        const index = $(this).data('child');
        const childDataSelector = `#child-data-${index}`;
        const agency = $(`${childDataSelector} input[type=radio][name=company]:checked`).val();
        
        $('#physical_shipment').hide();

        if (this.value == 'physical') {
            $('#physical_shipment_info').show();
            $('#child_photo_upload').removeClass('d-none');
        } else {
            $('#physical_shipment_info').hide();
            $('#child_photo_upload').addClass('d-none');
            $('#physical_shipment').hide();
        }
    });

    $('#child_birth_city_div').addClass();

    $('#child_birth_country').select2({
        language: 'it',
        width: '100%',
        data: [],
        placeholder: 'Scegli...',
    });

    $('#child_sex').on('select2:select select2:close', function (e) {
        if (!e.params.data && !viewData.childSex) {
            $('#child_sex_feedback').show();
        } else {
            $('#child_sex_feedback').hide();
        }
    });

    $('#child_birth_country').on('select2:select select2:close', function (e) {
        if (!e.params.data && !viewData.childBirthCountry) {
            $('#child_birth_country_feedback').show();
        } else {
            $('#child_birth_country_feedback').hide();
        }
        if (e.params && e.params.data) {
            viewData.childBirthCountry = e.params.data;
        }
    });

    $('#child_birth_city').on('select2:select select2:close', function (e) {
        if (!e.params.data && !viewData.childBirthCity) {
            $('#child_birth_city_feedback').show();
        } else {
            $('#child_birth_city_feedback').hide();
        }
        if (e.params && e.params.data) {
            viewData.childBirthCity = e.params.data;
        }
    });

    $('#child_residence_city').on('select2:select select2:close', function (e) {
        if (!e.params.data && !viewData.childResidenceCity) {
            $('#child_residence_city_feedback').show();
        } else {
            $('#child_residence_city_feedback').hide();
        }
        if (e.params && e.params.data) {
            viewData.childResidenceCity = e.params.data;
            checkResidenceCity();
        }
    });

    $('#child_school_municipality').on('select2:select select2:close', function (e) {
        if (!e.params.data && !viewData.child_school_municipality) {
            $('#child_school_municipality_feedback').show();
        } else {
            $('#child_school_municipality_feedback').hide();
        }
        if (e.params && e.params.data) {
            viewData.childSchoolMunicipality = e.params.data;
        }
    });

    $('#child_birth_date').change(function (e) {
        if ($('#child_birth_date').val()) {
            $.ajax({
                type: "get",
                url: API_BASE + '/countries',
                crossDomain: true,
                data: {
                    date: viewData.childBirthDate
                },
                dataType: "json",
                success: function (response) {
                    $('#child_birth_country').empty();
                    $('#child_birth_country').append(new Option('ITALIA', 'ITA', false, false), response.map(el => new Option(el.text, el.id, false, false)));
                    $('#child_birth_country').removeAttr('disabled');
                    $('#child_birth_country').val(null).trigger('change');
                    $('#child_birth_country_hint').hide();
                }
            });
            checkResidenceCity();
        }
    });

    $('#child_birth_country').on('select2:select', function (e) {
        if (e.params.data.id == 'ITA') {
            $('#child_birth_city').select2({
                language: 'it',
                width: '100%',
                placeholder: 'Scegli...',
                data: [],
                minimumInputLenght: 2,
                ajax: {
                    url: API_BASE + '/municipalities',
                    dataType: 'json',
                    data: function (params) {
                        const index = $(this).closest('form').data('child');
                        const childDataSelector = `#child-data-${index}`;
                        const birthDate = $(`${childDataSelector} #child_birth_date`).val();
                        return {
                            q: params.term, // search term,
                            date: birthDate
                        };
                    },
                    processResults: function (data) {
                        // Transforms the top-level key of the response object from 'items' to 'results'
                        return {
                            results: data
                        };
                    }
                }
            });
            $('#child_birth_city').val(null).trigger('change');
            $('#child_birth_city_div').show();
        }
        else {
            $('#child_birth_city_div').hide();
            viewData.childBirthCity = null;
        }
    });

    $.ajax({
        type: "get",
        url: API_BASE + '/countries',
        crossDomain: true,
        dataType: "json",
        success: function (response) {
            $('#child_residence_country').select2({
                language: 'it',
                width: '100%',
                data: response,
                placeholder: 'Scegli...',
            });
            $('#child_residence_country').val(null).trigger('change');
        }
    });

    $('#child_residence_country').on('select2:select', function (e) {
        if (e.params.data.id == 'ITA') {
            $('#child_residence_city').select2({
                language: 'it',
                width: '100%',
                placeholder: 'Scegli...',
                data: [],
                minimumInputLenght: 2,
                ajax: {
                    url: API_BASE + '/municipalities',
                    dataType: 'json',
                    data: function (params) {
                        return {
                            q: params.term, // search term
                            region: '08'
                        };
                    },
                    processResults: function (data) {
                        // Transforms the top-level key of the response object from 'items' to 'results'
                        return {
                            results: data
                        };
                    }
                }
            });
            $('#child_residence_city').val(null).trigger('change');
            $('#child_residence_locality_div').hide();
            $('#child_residence_city_div').show();
            $('#child_residence_city').val(null).trigger('change');
            $('#child_residence_locality').val(null).trigger('change');
        }
        else {
            $('#child_residence_city_div').hide();
            $('#child_residence_locality_div').show();
            $('#child_residence_city').val(null).trigger('change');
            viewData.childResidenceCity = null;
        }
    });

    $('#child_residence_country').on('select2:select select2:close', function (e) {
        if (!e.params.data && !viewData.childResidenceCountry) {
            $('#child_residence_country_feedback').show();
        } else {
            $('#child_residence_country_feedback').hide();
        }
        if (e.params && e.params.data) {
            viewData.childResidenceCountry = e.params.data;
        }
    });


    $('#urban_area_select').on('select2:select', function (e) {
        viewData.urbanArea = e.params.data;
        checkZones(e.target);
    });

    $('#suburban_start_area').on('select2:select', function (e) {
        viewData.suburbanStartArea = e.params.data;
        checkZones(e.target);
    });

    $('#suburban_end_area').on('select2:select', function (e) {
        viewData.suburbanEndArea = e.params.data;
        checkZones(e.target);
    });

    // $('#child_id_drop_zone').on('drop', function (e) {
    //     e.preventDefault();
    //     $('#child_id_drop_zone').addClass('drop-fail');
    //     if (photoFileTypes.includes(e.originalEvent.dataTransfer.files[0].type)) {
    //         if (file) {
    //             removeFile();
    //         }
    //         addFile(e.originalEvent.dataTransfer.files[0])
    //     }
    //     else {
    //         $('#child_id_drop_zone').addClass('drop-fail');
    //     }
    //     renderPhoto();
    // });

    // $('#child_id_drop_zone').on('dragover', function (e) {
    //     e.preventDefault();
    //     $('#child_id_drop_zone').removeClass('drop-fail');
    //     $('#child_id_drop_zone').addClass('drop');
    // });

    // $('#child_id_drop_zone').on('dragleave', function (e) {
    //     e.preventDefault();
    //     $('#child_id_drop_zone').removeClass('drop drop-fail');
    // });

    // $('#child_id_form').on('submit', function (e) {
    //     var uploadFiles = document.getElementById('child_id_input').files;
    //     e.preventDefault();

    //     //startUpload(uploadFiles)
    // });

    // $('#child_id_input').on('change', function (e) {
    //     if (file) {
    //         removeFile();
    //     }
    //     Array.from(e.target.files).forEach(file => {
    //         addFile(file)
    //     })
    //     renderPhoto();
    // });

    $.validator.addMethod(
        "regex",
        function (value, element, regexp) {
            var re = new RegExp(regexp);
            return this.optional(element) || re.test(value);
        },
        "Please check your input."
    );

    $.validator.addMethod("minDate", function (value, element, date) {
        var curDate = new Date(date);
        var inputDate = new Date(value);
        if (inputDate >= curDate)
            return true;
        return false;
    }, "Invalid Date!");

    $.validator.addMethod("maxDate", function (value, element, date) {
        var curDate = new Date(date);
        var inputDate = new Date(value);
        if (inputDate <= curDate)
            return true;
        return false;
    }, "Invalid Date!");

    $.validator.addMethod(
        "cf_child",
        function (value, element, enabled) {
            var success = false;
            test_element = element

            if (!validatingCF) {
                validatingCF = true;

                const index = $(element).data('child');
                const childDataSelector = `#child-data-${index}`;

                const name = $(`${childDataSelector} #child_name`).val();
                const surname = $(`${childDataSelector} #child_surname`).val();
                let gender = $(`${childDataSelector} #child_sex`).val();
                const birthDate = $(`${childDataSelector} #child_birth_date`).val();

                if (gender) {
                    gender = gender.toLowerCase();
                }

                const cfRequest = {
                    name: name,
                    surname: surname,
                    gender: gender,
                    birth_date: birthDate,
                    birth_country_code: (viewData.childBirthCountry && viewData.childBirthCountry.id !== 'ITA' && viewData.childBirthCountry.id !== 'ITALIA') ? viewData.childBirthCountry.id : undefined,
                    birth_municipality_code: viewData.childBirthCity ? viewData.childBirthCity.id : undefined,
                    fiscal_code: value
                };

                $(`${childDataSelector} #child_fiscal_code_invalid`).text('Il Codice fiscale non è valido');
                $.ajax({
                    url: `${API_BASE}/cf/validate`,
                    type: 'POST',
                    crossDomain: true,
                    data: JSON.stringify(cfRequest),
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    processData: false,
                    async: false,
                })
                .done(function (json) {
                    validatingCF = false;
                    if (json && json.valid == true) {
                        $('#messages').empty();
                        $(`${childDataSelector} #child_fiscal_code`).removeClass('is-invalid');
                        $(`${childDataSelector} #child_fiscal_code_invalid`).hide();
                        success = true;
                    } else {
                        if (json.error) {
                            $(`${childDataSelector} #child_fiscal_code_invalid`).text(json.error);
                        } else {
                            $(`${childDataSelector} #child_fiscal_code_invalid`).text('Il Codice fiscale non è valido');
                        }

                        $(`${childDataSelector} #child_fiscal_code`).addClass('is-invalid');
                        $(`${childDataSelector} #child_fiscal_code_invalid`).show();
                        $('#messages').html("Si è verificato un errore.");
                        success = false;
                    }
                })
                .fail(function (data) {
                    validatingCF = false;
                    $('#messages').html("Si è verificato un errore.");
                    $(`${childDataSelector} #child_fiscal_code`).addClass('is-invalid');
                    $(`${childDataSelector} #child_fiscal_code_invalid`).text('Il Codice fiscale non è valido');
                    $(`${childDataSelector} #child_fiscal_code_invalid`).show();
                    success = false;
                });
            } else {
                success = false;
            }
            return success;
        },
        "Please check your input."
    );

    $('input[type=radio][name=company]').change(function () {
        viewData.subscriptionCompany = this.value;
        $('#subscription_type_div').show();
        checkResidenceCity();

        const index = $(this).data('child');
        const childDataSelector = `#child-data-${index}`;

        $(`${childDataSelector} #urban_area_select`).val(null).trigger('change');
        $(`${childDataSelector} #suburban_start_area`).val(null).trigger('change');
        $(`${childDataSelector} #suburban_end_area`).val(null).trigger('change');

        viewData.urbanArea = undefined;
        viewData.suburbanStartArea = undefined;
        viewData.suburbanEndArea = undefined;

        viewData.shipment = undefined;
        $(`${childDataSelector} #shipping`).prop('checked', false);
        $(`${childDataSelector} #pick_up`).prop('checked', false);

        $(`${childDataSelector} #shipping`).prop('checked', true);
        $(`${childDataSelector} #pick_up`).prop('checked', false);
        $(`${childDataSelector} #physical_shipment`).hide();

        if (this.value === 'start') {
            $(`${childDataSelector} label[for=suburban_radio] div`).html('Abbonamento extraurbano / urbano due zone');
        } else {
            $(`${childDataSelector} label[for=suburban_radio] div`).html('Abbonamento extraurbano');
        }
    });

    $('input[type=radio][name=subscription_type]').change(function () {
        if (viewData.emissionType == 'physical') {
            const index = $(this).data('child');
            const childDataSelector = `#child-data-${index}`;
            const agency = $(`${childDataSelector} input[type=radio][name=company]:checked`).val();
            
            $('#physical_shipment').hide();
        }
        if (this.value == 'urban') {
            $('#urban_area_select').select2({
                language: 'it',
                width: '100%',
                placeholder: 'Scegli...',
                data: [],
                ajax: {
                    url: API_BASE + '/zones',
                    dataType: 'json',
                    data: function (params) {
                        return {
                            agency: viewData.subscriptionCompany,
                            urban: 1,
                            q: params.term, // search term,
                        };
                    },
                    processResults: function (data) {
                        // Transforms the top-level key of the response object from 'items' to 'results'
                        return {
                            results: data
                        };
                    }
                }
            });
            $('#urban_area_select').val(null).trigger('change');
            viewData.suburbanStartArea = null;
            viewData.suburbanEndArea = null;
            $('#suburban_select').hide();
            $('#urban_select').show();
        }
        if (this.value == 'suburban') {
            $('#suburban_start_area').select2({
                language: 'it',
                width: '100%',
                placeholder: 'Scegli...',
                data: [],
                ajax: {
                    url: API_BASE + '/zones',
                    dataType: 'json',
                    data: function (params) {
                        return {
                            agency: viewData.subscriptionCompany,
                            q: params.term, // search term,
                        };
                    },
                    processResults: function (data) {
                        // Transforms the top-level key of the response object from 'items' to 'results'
                        return {
                            results: data
                        };
                    }
                }
            });
            $('#suburban_end_area').select2({
                language: 'it',
                width: '100%',
                placeholder: 'Scegli...',
                data: [],
                ajax: {
                    url: API_BASE + '/zones',
                    dataType: 'json',
                    data: function (params) {
                        return {
                            agency: viewData.subscriptionCompany,
                            q: params.term, // search term
                        };
                    },
                    processResults: function (data) {
                        // Transforms the top-level key of the response object from 'items' to 'results'
                        return {
                            results: data
                        };
                    }
                }
            });
            $('#suburban_start_area').val(null).trigger('change');
            $('#suburban_end_area').val(null).trigger('change');
            $('#suburban_select').show();
            viewData.urbanArea = null;
            $('#urban_select').hide();
        }
        checkResidenceCity();
    });

    $('input[type=radio][name=physical_shipment]').change(function () {
        viewData.shipment = this.value;
    });

    $('input[type=radio][name=another_child]').change(function () {
        if (this.value == 'y') {
            newChild();
            renderChildren();
        }
    });

    $('#child_email').on("focusout", function (e) {
        const element = $(e.target);
        const index = element.data('child');
        const email = element.val();

        const warningElement = $(`#child-data-${index} #child-email-warning`);
        if (email === request.email) {
            warningElement.show();
        } else {
            warningElement.hide();
        }
    });

    $('[id^=child-data-]').validate({
        rules: {
            child_name: { required: true },
            child_surname: { required: true },
            child_sex: { required: true },
            child_birth_date: {
                required: true,
                minDate: '2007-01-01',
                maxDate: '2014-12-31'
            },
            child_birth_country: { required: true },
            child_birth_city: { required: true },
            child_fiscal_code: { required: true, cf_child: true },
            child_email: { required: false, email: true },
            child_phone: { required: false, regex: "^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[\s0-9]*$" },
            child_residence_country: { required: true },
            child_address: { required: true },
            child_civic_number: { required: true },
            child_zip_code: { required: true },

        },
        errorPlacement: function (error, element) { },
        submitHandler: function (form) {
            var success = false;
            // $(".submit").attr("disabled", true);

            children.forEach((child, index) => {
                const childDataSelector = `#child-data-${index + 1}`;

                const digitalEmission = $(`${childDataSelector} #emission-type-radio-1`).is(':checked');
                const physicalEmission = $(`${childDataSelector} #emission-type-radio-2`).is(':checked');

                if ((file && physicalEmission) || digitalEmission) {
                    const name = $(`${childDataSelector} #child_name`).val();
                    const surname = $(`${childDataSelector} #child_surname`).val();
                    const gender = $(`${childDataSelector} #child_sex`).val().toLowerCase();
                    const birthDate = $(`${childDataSelector} #child_birth_date`).val();
                    const birthCountry = viewData.childBirthCountry; // $(`${childDataSelector} #child_birth_country`).val();
                    const birthCity = viewData.childBirthCity; // $(`${childDataSelector} #child_birth_city`).val();
                    const fiscalCode = $(`${childDataSelector} #child_fiscal_code`).val();
                    const email = $(`${childDataSelector} #child_email`).val();
                    const phone = $(`${childDataSelector} #child_phone`).val();
                    const residenceCountry = viewData.childResidenceCountry;
                    const residenceCity = viewData.childResidenceCity;
                    const residenceLocality = $(`${childDataSelector} #child_residence_locality`).val();
                    const residenceAddress = $(`${childDataSelector} #child_residence_address`).val();
                    const civicNumber = $(`${childDataSelector} #child_civic_number`).val();
                    const zipCode = $(`${childDataSelector} #child_zip_code`).val();
                    const agency = viewData.subscriptionCompany;
                    const schoolName = $(`${childDataSelector} #child_school_name`).val();
                    const schoolMunicipality = viewData.childSchoolMunicipality;

                    let urban_area = null;
                    let starting_zone = null;
                    let ending_zone = null;

                    if (viewData.urbanArea) {
                        urban_area = viewData.urbanArea.id;

                    } else {
                        starting_zone = viewData.suburbanStartArea ? viewData.suburbanStartArea.id : undefined;
                        ending_zone = viewData.suburbanEndArea ? viewData.suburbanEndArea.id : undefined;
                    }

                    const delivery = viewData.shipment;

                    if (!request.children[index]) {
                        request.children[index] = {};
                    }

                    request.children[index].name = name;
                    request.children[index].surname = surname;
                    request.children[index].gender = gender;
                    request.children[index].birth_date = birthDate;

                    if (birthCountry.id !== 'ITA' && birthCountry.id !== 'ITALIA') {
                        request.children[index].birth_country_code = birthCountry.id;
                        request.children[index].birth_country_name = birthCountry.text;
                    } else {
                        request.children[index].birth_country_code = undefined;
                        request.children[index].birth_country_name = undefined;
                    }

                    if (birthCity) {
                        request.children[index].birth_municipality_code = birthCity.id;
                        request.children[index].birth_municipality_name = birthCity.text;
                    }

                    request.children[index].fiscal_code = fiscalCode;
                    request.children[index].email = email;
                    request.children[index].telephone = phone;

                    if (residenceCountry.id !== 'ITA' && residenceCountry.id !== 'ITALIA') {
                        request.children[index].residence_country_code = residenceCountry.id;
                        request.children[index].residence_country_name = residenceCountry.text;

                        request.children[index].residence_locality = residenceLocality;
                        request.children[index].residence_municipality_code = undefined;
                        request.children[index].residence_municipality_name = undefined;
                    } else {
                        request.children[index].residence_country_code = undefined;
                        request.children[index].residence_country_name = undefined;

                        if (residenceCity) {
                            request.children[index].residence_municipality_code = residenceCity.id;
                            request.children[index].residence_municipality_name = residenceCity.text;
                        }
                    }

                    request.children[index].residence_address = residenceAddress;
                    request.children[index].residence_street_number = civicNumber;
                    request.children[index].residence_cap = zipCode;

                    request.children[index].school_name = schoolName;
                    request.children[index].school_municipality_code = schoolMunicipality.id;
                    request.children[index].school_municipality_name = schoolMunicipality.text;

                    // titolo di viaggio
                    request.children[index].card_type = physicalEmission ? 'physical' : 'digital';
                    request.children[index].photo = physicalEmission ? file.id : null;
                    request.children[index].agency = agency;
                    request.children[index].urban_area = urban_area;
                    request.children[index].starting_zone = starting_zone;
                    request.children[index].ending_zone = ending_zone;
                    
                    request.children[index].delivery = physicalEmission ? 'home' : undefined;

                    success = true;

                    if (!agency) {
                        sucess = false;
                    }
                } else {
                    $('#child_id_drop_zone').addClass('drop-fail');
                    success = false;
                }
            });

            if (success) {
                initRiepilogo();
                stepper.next();
                // const areZonesValid = checkZones($(`${childDataSelector} #child_name`)); // scelto un elemento a caso, figlio del form child-data-X

                // if (areZonesValid) {
                //     initRiepilogo();
                //     stepper.next();
                // }
            }
        }
    });

    var checkResidenceCity = function () {
        const childDataSelector = `#child-data-1`;
        const startDate = new Date('2010-01-01');
        const endDate = new Date('2014-12-31');

        const excludedMunicipalities = [
            'A944',
            'B819',
            'B880',
            'C573',
            'D458',
            'D548',
            'D704',
            'E136',
            'E289',
            'F257',
            'G337',
            'G535',
            'H199',
            'H223',
            'H294',
            'H945',
        ];

        var date;
        var birthDate = $(`${childDataSelector} #child_birth_date`).val();
        if (birthDate) {
            date = new Date(birthDate);
        }

        const subscriptionType = $(`${childDataSelector} input[type=radio][name=subscription_type]:checked`).val();

        if (date && viewData.childResidenceCity) {
            $(`#dati-ragazzo-1 #stepper-info-error-message`).empty();

            const errorMessage = `Non puoi richiedere questo abbonamento urbano, i residenti a ${viewData.childResidenceCity.text} nati nel periodo 2010-2014 riceveranno automaticamente a casa una tessera abbonamento.`;
            if (subscriptionType === 'urban' &&
                excludedMunicipalities.includes(viewData.childResidenceCity.id) &&
                (date >= startDate && date <= endDate)) {
                $('#step-2-next').prop('disabled', true);
                $('#stepper-info').removeClass('d-none');
                $('#stepper-info').addClass('d-flex');
                $(`#dati-ragazzo-1 #stepper-info-error-message`).html(errorMessage);
            } else {
                $('#step-2-next').prop('disabled', false);
                $('#stepper-info').removeClass('d-flex');
                $('#stepper-info').addClass('d-none');
            }
        }
    }

    var checkZones = function (callerElement) {
        if (!callerElement || !$(callerElement)) { return }

        const index = $(callerElement).closest('form').data('child');
        const childDataSelector = `#child-data-${index}`;

        const agency = $(`${childDataSelector} input[type=radio][name=company]:checked`).val();
        const subscriptionType = $(`${childDataSelector} input[type=radio][name=subscription_type]:checked`).val();

        const urbanAreaSelected = $(`${childDataSelector} #urban_area_select`).find(':selected');
        const startingZoneSelected = $(`${childDataSelector} #suburban_start_area`).find(':selected');
        const endingZoneSelected = $(`${childDataSelector} #suburban_end_area`).find(':selected');

        let urbanArea = undefined;
        let startingZone = undefined;
        let endingZone = undefined;

        if (subscriptionType === 'urban') {
            urbanArea = (urbanAreaSelected && urbanAreaSelected.val() !== '') ? urbanAreaSelected.val() : undefined;
        } else if (subscriptionType === 'suburban') {
            startingZone = (startingZoneSelected && startingZoneSelected.val() !== '') ? startingZoneSelected.val() : undefined;
            endingZone = (endingZoneSelected && endingZoneSelected.val() !== '') ? endingZoneSelected.val() : undefined;
        }

        if (subscriptionType === 'suburban' && ((startingZone && !endingZone) || (!startingZone && endingZone))) {
            return;
        }

        $('#step-2-next').prop('disabled', false);
        $('#stepper-info').removeClass('d-flex');
        $('#stepper-info').addClass('d-none');

        const request = {
            agency: agency,
            urban_area: urbanArea,
            starting_zone: startingZone,
            ending_zone: endingZone,
        };

        let success = false;

        $.ajax({
            url: `${API_BASE}/zones/validate`,
            type: 'POST',
            crossDomain: true,
            data: JSON.stringify(request),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            processData: false,
            async: false,
        })
            .done(function (json) {
                console.log(json);
                if (json && json.valid == true) {
                    success = true;
                    $('#messages').empty();
                    $('#step-2-next').prop('disabled', false);
                    $(`#dati-ragazzo-${index} #stepper-info-error-message-zones`).empty();
                } else {
                    success = false;
                    $('#messages').html("Si è verificato un errore.");
                    $('#step-2-next').prop('disabled', true);
                    $('#stepper-info-2').removeClass('d-none');
                    $('#stepper-info-2').addClass('d-flex');
                    $(`#dati-ragazzo-${index} #stepper-info-error-message-zones`).html("Le zone scelte non sono valide.");
                }
            })
            .fail(function (error) {
                console.log(error)
                success = false;
                $('#step-2-next').prop('disabled', true);
                if (error && error.responseJSON && error.responseJSON.errors) {
                    const errors = Object.values(error.responseJSON.errors);
                    const flattenedErrors = [].concat(...errors).map(err => `<div>${err}</div>`);
                    $('#messages').html(flattenedErrors);
                    $('#stepper-info-2').removeClass('d-none');
                    $('#stepper-info-2').addClass('d-flex');
                    $(`#dati-ragazzo-${index} #stepper-info-error-message-zones`).html(flattenedErrors);
                } else {
                    $('#messages').html("Si è verificato un errore.");
                }
            });

        return success;
    }

    var childFilerOptions = {
        showThumbs: true,
        addMore: false,
        allowDuplicates: false,
        limit: 1,
        extensions: ['png', 'jpeg', 'jpg'],
        captions: {
            button: "SFOGLIA",
            feedback: "Seleziona il file da caricare",
            feedback2: "File selezionato",
            drop: "Trascina il file per caricare",
            removeConfirmation: "Vuoi rimuovere questo file?",
            errors: {
                filesLimit: "puoi caricare al massimo {{fi-limit}} file",
                filesType: "Puoi caricare solo immagini o pdf",
                filesSize: "{{fi-name}} è troppo grande! Dimensione massima: {{fi-fileMaxSize}} MB.",
                filesSizeAll: "Complessivamente i file possono supeare i {{fi-maxSize}} MB.",
                folderUpload: "Non puoi caricare cartelle"
            }
        },
        uploadFile: {
            url: API_BASE + '/forms/' + formCode + '/photos',
            type: 'POST',
            processData: false,
            contentType: false,
            beforeSend: function (a, b, c, d, e, f, g, request) {
                const formData = request.data;
                if (childCodeTmp) {
                    formData.append('child', childCodeTmp);
                }
            },
            success: function (data, itemEl, listEl, boxEl, newInputEl, inputEl, id) {
                if (!childCodeTmp) {
                    childCodeTmp = data.child;
                }

                var document = {
                    id: data.photo,
                };
                $('#photo_replace_info').show();
                file = document;

                const index = $(inputEl).data('child');

                if (!request.children[index - 1]) {
                    request.children[index - 1] = {};
                }
                request.children[index - 1].code = data.child;

                console.log(file)
            },
            error: function (el, b, c, d, e, f, error, h, i) {
                console.log(error)

                var errorMessage = 'Si è verificato un errore.';

                if (error && error.responseJSON && error.responseJSON.errors) {
                    const errors = Object.values(error.responseJSON.errors);
                    const flattenedErrors = [].concat(...errors).map(err => `<div>${err}</div>`);
                    errorMessage = flattenedErrors;
                } else {
                    errorMessage = 'Si è verificato un errore.';
                }

                var parent = el.find(".jFiler-jProgressBar").parent();
                el.find(".jFiler-jProgressBar").fadeOut("slow", function () {
                    $(`<div class="jFiler-item-others text-error"><i class="icon-jfi-minus-circle"></i>${errorMessage}</div>`).hide().appendTo(parent).fadeIn("slow");
                });
            },
        },
        onRemove: function (itemEl, uploadedFile, id, listEl, boxEl, newInputEl, inputEl) {
            $.ajax({
                url: API_BASE + '/forms/' + formCode + '/children/' + childCodeTmp + '/photos/' + file.id,
                type: "DELETE",
                crossDomain: true,
                dataType: 'json',
                processData: false,
                contentType: false,
                success: function (result) {
                    console.log(result);
                    file = null
                }
            });
        },
        templates: {
            box: '<ul class="jFiler-items-list jFiler-items-grid"></ul>',
            item: '<li class="jFiler-item">\
						<div class="jFiler-item-container">\
							<div class="jFiler-item-inner">\
								<div class="jFiler-item-thumb">\
									<div class="jFiler-item-status"></div>\
									<div class="jFiler-item-thumb-overlay">\
										<div class="jFiler-item-info">\
											<div style="display:table-cell;vertical-align: middle;">\
												<span class="jFiler-item-title"><b title="{{fi-name}}">{{fi-name}}</b></span>\
												<span class="jFiler-item-others">{{fi-size2}}</span>\
											</div>\
										</div>\
									</div>\
									{{fi-image}}\
								</div>\
								<div class="jFiler-item-assets jFiler-row">\
									<ul class="list-inline pull-left">\
										<li>{{fi-progressBar}}</li>\
									</ul>\
									<ul class="list-inline pull-right">\
										<li><a class="icon-jfi-trash jFiler-item-trash-action"></a></li>\
									</ul>\
								</div>\
							</div>\
						</div>\
					</li>',
            itemAppend: '<li class="jFiler-item">\
							<div class="jFiler-item-container">\
								<div class="jFiler-item-inner">\
									<div class="jFiler-item-thumb">\
										<div class="jFiler-item-status"></div>\
										<div class="jFiler-item-thumb-overlay">\
											<div class="jFiler-item-info">\
												<div style="display:table-cell;vertical-align: middle;">\
													<span class="jFiler-item-title"><b title="{{fi-name}}">{{fi-name}}</b></span>\
													<span class="jFiler-item-others">{{fi-size2}}</span>\
												</div>\
											</div>\
										</div>\
										{{fi-image}}\
									</div>\
									<div class="jFiler-item-assets jFiler-row">\
										<ul class="list-inline pull-left">\
											<li><span class="jFiler-item-others">{{fi-icon}}</span></li>\
										</ul>\
										<ul class="list-inline pull-right">\
											<li><a class="icon-jfi-trash jFiler-item-trash-action"></a></li>\
										</ul>\
									</div>\
								</div>\
							</div>\
						</li>',
            progressBar: '<div class="bar"></div>',
            itemAppendToEnd: false,
            canvasImage: true,
            removeConfirmation: true,
            _selectors: {
                list: '.jFiler-items-list',
                item: '.jFiler-item',
                progressBar: '.bar',
                remove: '.jFiler-item-trash-action'
            }
        },
    };


    $('#child_id_input').filer(childFilerOptions);
};