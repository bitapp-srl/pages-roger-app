
$().ready(function () {

    var files = [];
    var alreadyLoadedChildren = false;
    var validatingCF = false;

    var filerOptions = {
        showThumbs: true,
        addMore: false,
        allowDuplicates: false,
        limit: 1,
        extensions: ['png', 'jpeg', 'pdf', 'jpg'],
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
            url: API_BASE + '/documents',
            type: 'POST',
            processData: false,
            contentType: false,
            beforeSend: function (a, b, c, d, e, f, g, request) {
                $('#filer_input_front').prop('disabled', true);
                $('#filer_input_back').prop('disabled', true);
                const formData = request.data;
                if (formCode) {
                    formData.append('form', formCode);
                }
            },
            success: function (data, itemEl, listEl, boxEl, newInputEl, inputEl, id) {
                if (!formCode) {
                    formCode = data.form;
                }
                var document = {
                    id: data.document
                };
                files.push(document);
                request.documents[$(inputEl).data('index')] = data.document;

                $('#filer_input_front').prop('disabled', false);
                $('#filer_input_back').prop('disabled', false);
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

                $('#filer_input_front').prop('disabled', false);
                $('#filer_input_back').prop('disabled', false);
            },
        },
        onRemove: function (itemEl, file, id, listEl, boxEl, newInputEl, inputEl) {
            if (files.length > 1) {
                const file_id = files[id].id;
                $.ajax({
                    url: API_BASE + '/forms/' + formCode + '/documents/' + file_id,
                    type: "DELETE",
                    crossDomain: true,
                    dataType: 'json',
                    processData: false,
                    contentType: false,
                    success: function (result) {
                        console.log(result);
                        files = files.filter(fi => fi.id !== files[id].id);
                    }
                });
            }
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

    $('#filer_input_front').filer(filerOptions);
    $('#filer_input_back').filer(filerOptions);

    const flatpickrConfig = {
        locale: "it",
        altInput: true,
        altFormat: 'd-m-Y',
        dateFormat: 'Y-m-d',
        allowInput: true,
        onClose: function (selectedDates, dateStr, instance) {
            console.log(selectedDates);
        }
    };

    $('#parent_sex').select2({
        theme: 'bootstrap4',
        language: 'it',
        width: '100%',
        minimumResultsForSearch: -1,
        placeholder: ''
    });

    const datePicker = $("#parent_birth_date").flatpickr(flatpickrConfig);


    $('#parent_birth_city_div').addClass();

    $('#parent_birth_country').select2({
        theme: 'bootstrap4',
        language: 'it',
        width: '100%',
        data: [],
        placeholder: 'Scegli...',
    });

    $('#parent_sex').on('select2:select select2:close', function (e) {
        if (!e.params.data && !viewData.parentSex) {
            $('#parent_sex_feedback').show();
        } else {
            $('#parent_sex_feedback').hide();
        }
    });

    $('#parent_birth_country').on('select2:select select2:close', function (e) {
        if (!e.params.data && !viewData.parentBirthCountry) {
            $('#parent_birth_country_feedback').show();
        } else {
            $('#parent_birth_country_feedback').hide();
        }
    });

    $('#parent_birth_city').on('select2:select select2:close', function (e) {
        if (!e.params.data && !viewData.parentBirthCity) {
            $('#parent_birth_city_feedback').show();
        } else {
            $('#parent_birth_city_feedback').hide();
        }
        if (e.params) {
            viewData.parentBirthCity = e.params.data;
        }
    });

    $('#parent_residence_city').on('select2:select select2:close', function (e) {
        if (!e.params.data && !viewData.parentResidenceCity) {
            $('#parent_residence_city_feedback').show();
        } else {
            $('#parent_residence_city_feedback').hide();
        }
    });

    $('#parent_residence_country').on('select2:select select2:close', function (e) {
        if (!e.params.data && !viewData.parentResidenceCountry) {
            $('#parent_residence_country_feedback').show();
        } else {
            $('#parent_residence_country_feedback').hide();
        }
    });


    $('#parent_birth_date').change(function (e) {
        if ($('#parent_birth_date').val()) {
            $.ajax({
                type: "get",
                url: API_BASE + '/countries',
                crossDomain: true,
                data: {
                    date: viewData.parentBirthDate
                },
                dataType: "json",
                success: function (response) {
                    $('#parent_birth_country').empty();
                    $('#parent_birth_country').append(new Option('ITALIA', 'ITA', false, false), response.map(el => new Option(el.text, el.id, false, false)));
                    $('#parent_birth_country').removeAttr('disabled');
                    $('#parent_birth_country').val(null).trigger('change');
                    $('#parent_birth_country_hint').hide();
                }
            });
        }
    });

    $('#parent_birth_country').on('select2:select', function (e) {
        viewData.parentBirthCountry = e.params.data;
        if (e.params.data.id == 'ITA') {
            $('#parent_birth_city').select2({
                theme: 'bootstrap4',
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
                            q: params.term, // search term,
                            date: viewData.parentBirthDate
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
            $('#parent_birth_city').val(null).trigger('change');
            $('#parent_birth_city_div').show();
        }
        else {
            $('#parent_birth_city_div').hide();
            viewData.parentBirthCity = null;
        }
    });


    $.ajax({
        type: "get",
        url: API_BASE + '/countries',
        crossDomain: true,
        dataType: "json",
        success: function (response) {
            $('#parent_residence_country').select2({
                theme: 'bootstrap4',
                language: 'it',
                width: '100%',
                data: response,
                placeholder: 'Scegli...',
            });
            $('#parent_residence_country').val(null).trigger('change');
        }
    });

    $('#parent_residence_country').on('select2:select', function (e) {
        viewData.parentResidenceCountry = e.params.data;
        if (e.params.data.id == 'ITA') {
            $('#parent_residence_city').select2({
                theme: 'bootstrap4',
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
                            // region: '08',
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
            $('#parent_residence_city').removeAttr('disabled');
            $('#parent_residence_city').val(null).trigger('change');
            $('#parent_residence_locality_div').hide();
            $('#parent_residence_city_div').show();
            $('#parent_residence_locality').val(null).trigger('change');
        } else {
            $('#parent_residence_city_div').hide();
            $('#parent_residence_locality_div').show();
            $('#parent_residence_city').val(null).trigger('change');
            viewData.parentResidenceCity = null;
        }
    });

    $('#parent_residence_city').on('select2:select', function (e) {
        viewData.parentResidenceCity = e.params.data;
    })

    $('#children_number_select').select2({
        language: 'it',
        width: '15%',
        placeholder: 'Scegli...',
        minimumResultsForSearch: -1
    });

    $('#children_number_select').on('select2:select', function (e) {
        childrenNumber = e.params.data.text;
        renderSteps();
    })

    $.validator.addMethod(
        "regex",
        function (value, element, regexp) {
            var re = new RegExp(regexp);
            return this.optional(element) || re.test(value);
        },
        "Please check your input."
    );

    $.validator.addMethod(
        "cf_parent",
        function (value, element, enabled) {
            var success = false;

            if (!validatingCF) {
                validatingCF = true;

                const birthCountry = $('#parent-data #parent_birth_country').find(':selected');

                var birthCountryCode = undefined;

                if (birthCountry && birthCountry.val() !== 'ITA' && birthCountry.val() !== 'ITALIA') {
                    birthCountryCode = birthCountry.val();
                }

                const birthCity = $('#parent-data #parent_birth_city');

                const cfRequest = {
                    name: $('#parent-data #parent_name').val(),
                    surname: $('#parent-data #parent_surname').val(),
                    gender: $('#parent-data #parent_sex').val() ? $('#parent-data #parent_sex').val().toLowerCase() : undefined,
                    birth_date: $('#parent-data #parent_birth_date').val(),
                    birth_country_code: birthCountryCode,
                    birth_municipality_code: birthCity ? birthCity.val() : undefined,
                    fiscal_code: value
                };

                $('#parent_fiscal_code_invalid').text('Il Codice fiscale non è valido');
                $.ajax({
                    url: `${API_BASE}/cf/validate`,
                    type: 'POST',
                    crossDomain: true,
                    data: JSON.stringify(cfRequest),
                    contentType: 'application/json; charset=utf-8',
                    processData: false,
                    async: false,
                })
                .done(function (json) {
                    validatingCF = false;
                    if (json && json.valid == true) {
                        $('#messages').empty();
                        $('#parent_fiscal_code').removeClass('is-invalid');
                        $('#parent_fiscal_code_invalid').hide();
                        success = true;
                    } else {
                        if (json.error) {
                            $('#parent_fiscal_code_invalid').text(json.error);
                        } else {
                            $('#parent_fiscal_code_invalid').text('Il Codice fiscale non è valido');
                        }

                        $('#parent_fiscal_code_invalid').show();
                        $('#parent_fiscal_code').addClass('is-invalid');
                        $('#messages').html("Si è verificato un errore.");
                        success = false;
                    }
                })
                .fail(function (data) {
                    validatingCF = false;
                    $('#messages').html("Si è verificato un errore.");
                    $('#parent_fiscal_code_invalid').text('Il Codice fiscale non è valido');
                    $('#parent_fiscal_code_invalid').show();
                    success = false;
                });
            } else {
                success = false;
            }
            validatingCF = false;
            return success;
        },
        "Please check your input."
    );

    $('#parent-data').validate({
        rules: {
            parent_name: { required: true },
            parent_surname: { required: true },
            parent_sex: { required: true },
            parent_birth_date: { required: true, minlength: 10, maxlength: 10 },
            parent_birth_country: { required: true },
            parent_birth_city: { required: true },
            parent_fiscal_code: { required: true, cf_parent: true },
            parent_email: { required: true, email: true },
            parent_phone: { required: true, regex: "^[+]{0,1}[0-9]*[ ]{0,1}[-\s\./0-9]*$" },
            parent_residence_country: { required: true },
            parent_address: { required: true },
            parent_civic_number: { required: true },
            parent_zip_code: { required: true },

        },
        errorClass: 'is-invalid',
        validClass: 'is-valid',
        highlight: function (element, errorClass, validClass) {
            $(element).addClass(errorClass).removeClass(validClass);
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass(errorClass).addClass(validClass);
        },
        errorPlacement: function (error, element) { },
        submitHandler: function (form) {
            if (files.length) {
                request.name = viewData.parentName;
                request.surname = viewData.parentSurname;
                request.gender = viewData.parentSex ? viewData.parentSex.toLowerCase() : undefined;
                request.birth_date = viewData.parentBirthDate;

                if (viewData.parentBirthCountry.id !== 'ITA' && viewData.parentBirthCountry.id !== 'ITALIA') {
                    request.birth_country_code = viewData.parentBirthCountry.id;
                    request.birth_country_name = viewData.parentBirthCountry.text;
                } else {
                    request.birth_country_code = undefined;
                    request.birth_country_name = undefined;
                }

                if (viewData.parentBirthCity) {
                    request.birth_municipality_code = viewData.parentBirthCity.id;
                    request.birth_municipality_name = viewData.parentBirthCity.text;
                }
                request.fiscal_code = viewData.parentFiscalCode;
                request.email = viewData.parentEmail;
                request.telephone = viewData.parentPhone;

                if (viewData.parentResidenceCountry.id !== 'ITA' && viewData.parentResidenceCountry.id !== 'ITALIA') {
                    request.residence_country_code = viewData.parentResidenceCountry.id;
                    request.residence_country_name = viewData.parentResidenceCountry.text;
                    request.residence_locality = viewData.parentResidenceLocality;
                    request.residence_municipality_code = undefined;
                    request.residence_municipality_name = undefined;
                } else {
                    request.residence_country_name = undefined;
                    request.residence_country_code = undefined;

                    if (viewData.parentResidenceCity) {
                        request.residence_municipality_code = viewData.parentResidenceCity.id;
                        request.residence_municipality_name = viewData.parentResidenceCity.text;
                    }
                }

                request.residence_address = viewData.parentResidenceAddress;
                request.residence_street_number = viewData.parentCivicNumber;
                request.residence_cap = viewData.parentZipCode;

                if (!alreadyLoadedChildren) {
                    for (let i = 0; i < childrenNumber; i++) {
                        children.push({
                            id: i
                        })
                    }

                    $.get(`${BASE_URI}/html/dati-ragazzo-x.html`, function (data) {
                        const baseForm = data;
                        children.forEach(function (child, index) {
                            const childForm = baseForm.replace(/{{[\s]*index[\s]*}}/gim, index + 1)
                                .replace(/{{[\s]*BASE_URL[\s]*}}/gim, BASE_URI);
                            $('#children-container').append(childForm);
                            initStep2();
                        });
                    });

                    alreadyLoadedChildren = true;
                }

                stepper.next();
            } else {
                $('#parent_id_front_drop_zone').addClass('drop-fail');
                $('#parent_id_back_drop_zone').addClass('drop-fail');
            }
        }
    });
});






