var initRiepilogo = function () {
    $("#raw-summary").html(JSON.stringify(request, null, 2));

    $("#r_parent_name").text(request.name);
    $("#r_parent_surname").text(request.surname);
    $("#r_parent_surname").text(request.surname);
    $("#r_parent_gender").text(request.gender.toUpperCase());
    $("#r_parent_birth_date").text(request.birth_date);
    $("#r_parent_birth_country").text(request.birth_country_name ?? 'ITALIA');
    if (request.birth_municipality_name) {
        $('#r_parent_birth_city_div').removeClass('d-none');
        $('#r_parent_birth_city_div').addClass('d-flex');
        $('#r_parent_birth_city').text(request.birth_municipality_name);
    }
    $("#r_parent_fiscal_code").text(request.fiscal_code);
    $("#r_parent_email").text(request.email);
    $("#r_parent_telephone").text(request.telephone);
    $("#r_parent_residence_country").text(request.residence_country_name ?? 'ITALIA');
    if (request.residence_municipality_name) {
        $('#r_parent_residence_city').text(request.residence_municipality_name);
    } else {
        $('#r_parent_residence_city').text(request.residence_locality);
    }

    $("#r_parent_residence_address").text(request.residence_address + ' ' + request.residence_street_number + ' ' + request.residence_cap);


    // DA PARAMETRIZZARE 
    $("#r_children_name").text(request.children[0].name);
    $("#r_children_surname").text(request.children[0].surname);
    
    if (request.children[0].gender) {
        $("#r_children_gender").text(request.children[0].gender.toUpperCase()); 
    }
    
    $("#r_children_birth_date").text(request.children[0].birth_date);
    $("#r_children_birth_country").text(request.children[0].birth_country_name ?? 'ITALIA');
    if (request.children[0].birth_municipality_name) {
        $('#r_children_birth_city_div').removeClass('d-none');
        $('#r_children_birth_city_div').addClass('d-flex');
        $('#r_children_birth_city').text(request.children[0].birth_municipality_name);
    }
    $("#r_children_fiscal_code").text(request.children[0].fiscal_code);
    $("#r_children_email").text(request.children[0].email);
    $("#r_children_telephone").text(request.children[0].telephone);
    $("#r_children_residence_country").text(request.children[0].residence_country_name ?? 'ITALIA');
    if (request.children[0].residence_municipality_name) {
        $('#r_children_residence_city').text(request.children[0].residence_municipality_name);
    } else {
        $('#r_children_residence_city').text(request.children[0].residence_locality);
    }
    $("#r_children_residence_address").text(request.children[0].residence_address + ' ' + request.children[0].residence_street_number + ' ' + request.children[0].residence_cap);
    $("#r_children_emission").text(request.children[0].card_type === 'physical' ? 'Tessera Fisica' : 'Digitale su APP Roger');
    
    if (request.children[0].agency) {
        $("#r_children_agency").text(request.children[0].agency.toUpperCase());
    }

    if (request.children[0].school_name) {
        $("#r_children_school_name").text(request.children[0].school_name.toUpperCase());
    }

    if (request.children[0].school_municipality_name) {
        $("#r_children_school_municipality_name").text(request.children[0].school_municipality_name.toUpperCase());
    } 

    //PARSE DELLE TRATTE
    if (request.children[0].urban_area) {
        $('#r_children_route_label').text('Zona urbana');
        $("#r_children_route").text(request.children[0].urban_area);
    } else if (request.children[0].starting_zone && request.children[0].ending_zone) {
        $('#r_children_route_label').text('Tratta');
        $("#r_children_route").text(request.children[0].starting_zone + ' - ' + request.children[0].ending_zone);
    }

    if (request.children[0].card_type === 'physical') {
        const delivery = request.children[0].delivery === 'home' ? 'Spedizione' : 'Ritiro in biglietteria';
        $("#r_children_delivery").show();
        $("#r_children_delivery").text(delivery);
    } else {
        $("#r_children_delivery").hide();
    }

    var privacy_url = '/grande/informativa';

    switch (request.children[0].agency) {
        case 'tper':
            privacy_url = 'https://www.tper.it/cliente/note-legali-e-sulla-tutela-dei-dati-personali';
            break;
        case 'seta':
            privacy_url = 'https://setaweb.it/materiale/privacy/Informativa_Privacy_ABBONAMENTI.pdf';
            break;
        case 'start':
            privacy_url = 'https://www.startromagna.it/contatti/privacy/';
            break;
        case 'tep':
            privacy_url = 'http://www.tep.pr.it/contatti/informazioni_alla_clientela/informativa_portale_regionale_richiesta_abbonamenti_gratuiti.aspx';
            break;
    
        default:
            privacy_url = '/grande/informativa';
            break;
    }

    $('#privacy_link').attr('href', privacy_url);


    $('#summary').validate({
        rules: {
            privacy: { required: true },
            penal: { required: true }
        },
        messages: {
            privacy: " Questo campo è obbligatorio",
            penal: " Questo campo è obbligatorio"
        },
        errorClass: 'text-danger',
        highlight: function (element, errorClass, validClass) {
            $(element).addClass(errorClass).removeClass(validClass);
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass(errorClass).addClass(validClass);
        },
        submitHandler: function (form) {
            $('#messages-riepilogo').empty();

            Swal.fire({
                title: 'Vuoi davvero confermare l’invio?',
                text: "Non potrai più modificare i dati inseriti!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Annulla',
                confirmButtonText: 'Conferma'
            }).then((result) => {
                if (result.value) {
                    $('#step-riepilogo-submit').prop('disabled', true);
                    $('#step-riepilogo-submit').text('Carico...');

                    request.children[0].privacy = $('#privacy').is(':checked');
                    request.penal = $('#penal').is(':checked');

                    $.ajax({
                        url: `${API_BASE}/forms/${formCode}/submit`,
                        type: 'POST',
                        crossDomain: true,
                        data: JSON.stringify(request),
                        dataType: 'json',
                        contentType: 'application/json; charset=utf-8',
                        processData: false,
                    })
                    .done(function (json) {
                        console.log(json);
                        $('#riepilogo-content').hide();
                        $('#submit-success').show();
                        $('#step-riepilogo-submit').prop('disabled', false);
                        $('#step-riepilogo-submit').text('Conferma');
                        window.onbeforeunload = null;
                    })
                    .fail(function (data) {
                        console.error(data);
                        $('#step-riepilogo-submit').prop('disabled', false);
                        $('#step-riepilogo-submit').text('Conferma');
                        if (data && data.responseJSON && data.responseJSON.errors) {
                            const errors = Object.values(data.responseJSON.errors);
                            const flattenedErrors = [].concat(...errors).map(err => `<div>${err}</div>`);
                            $('#messages-riepilogo').html(flattenedErrors);
                        } else {
                            $('#messages-riepilogo').html("Si è verificato un errore.");
                        }
                    });
                }
            });
        }

    });
};