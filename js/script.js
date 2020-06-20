$(document).ready(function () {
    changeFrame(0);
    atualizaEmpregados();
});

function atualizaEmpregados() {
    $("#table tr").remove();

    var cabecalho = "<tr>";
    cabecalho += "<th>Id</th>";
    cabecalho += "<th>Nome</th>";
    cabecalho += "<th>Salário</th>";
    cabecalho += "<th>Idade</th>";
    cabecalho += "<th>Avatar</th>";
    cabecalho += "<th>Ações</th>";
    cabecalho += "</tr>";

    document.getElementById("default_table").insertRow(-1).innerHTML = cabecalho;

    var xHttpRequest = new XMLHttpRequest();

    xHttpRequest.onreadystatechange = function () {
        try {
            if (xHttpRequest.readyState === 4) {
                if (xHttpRequest.status === 200) {
                    var empregados = JSON.parse(xHttpRequest.responseText).data;
                    for (var i = 0; i < empregados.length; i++) {
                        addEmpregadoLista(empregados[i], i + 1);
                    }
                } else {
                    alert("Ocorreu um erro ao buscar empregados!");
                }
            }
        } catch (e) {
            alert('Ocorreu uma exceção: ' + e.description);
        }
    };

    xHttpRequest.open('GET', 'http://rest-api-employees.jmborges.site/api/v1/employees', true);
    xHttpRequest.setRequestHeader("Content-Type", "application/json");
    xHttpRequest.send();

}

function addEmpregadoLista(empregado, numRow) {
    var id = String(empregado.id);
    var sal = parseFloat(empregado.employee_salary);
    if (isNaN(sal)) {
        sal = 0;
    }

    var element = "<tr>";
    element += "<td>" + parseInt(id) + "</td>";
    element += "<td>" + String(empregado.employee_name) + "</td>";
    element += "<td> R$ " + sal + "</td>";
    element += "<td>" + String(empregado.employee_age) + "</td>";
    element += "<td><button class=\"colorful\"><a href=\"" + empregado.profile_image + "\") target=\"_blank\">...</a></button></td>";
    element += "<td> <button class=\"colorful\" onclick=\"editarEmpregado(\'" + id + "\')\">Editar</button>";
    element += "<button class=\"colorful\" onclick=\"excluirEmpregado(\'" + id + "\', " + numRow + ")\">Excluir</button> </td>";
    element += "</tr>";

    document.getElementById("default_table").insertRow(-1).innerHTML = element;
}

function editarEmpregado(id) {
    var xHttpRequest = new XMLHttpRequest();

    xHttpRequest.onreadystatechange = function () {
        try {
            if (xHttpRequest.readyState === 4) {
                if (xHttpRequest.status === 200) {
                    var empregado = JSON.parse(xHttpRequest.responseText).data;
                    changeFrame(1);
                    formCadastro = false;
                    $("#nome").val(empregado.employee_name);
                    $("#sal").val(empregado.employee_salary);
                    $("#idade").val(empregado.employee_age);
                    $("#avatar").val(empregado.profile_image);
                    idEmpregado = String(empregado.id);
                } else {
                    alert("Ocorreu um erro ao buscar valores do empregado!");
                }
            }
        } catch (e) {
            alert('Ocorreu uma exceção: ' + e.description);
        }
    };

    xHttpRequest.open('GET', 'http://rest-api-employees.jmborges.site/api/v1/employee/' + id, true);
    xHttpRequest.setRequestHeader("Content-Type", "application/json");
    xHttpRequest.send();
}

function excluirEmpregado(id, numRow) {
    $("#modal").css("display", "flex");

    $(".opExclusao").click(function () {
        if (this.id == "sim") {
            var xHttpRequest = new XMLHttpRequest();

            xHttpRequest.onreadystatechange = function () {
                try {
                    if (xHttpRequest.readyState === 4) {
                        if (xHttpRequest.status === 200) {
                            $("#table tr:eq(" + numRow + ")").remove();
                        } else {
                            alert("Ocorreu um erro ao tentar excluir o empregado!");
                        }
                    }
                } catch (e) {
                    alert('Ocorreu uma exceção: ' + e.description);
                }
            };

            xHttpRequest.open('DELETE', 'http://rest-api-employees.jmborges.site/api/v1/delete/' + id, true);
            xHttpRequest.setRequestHeader("Content-Type", "application/json");
            xHttpRequest.send();
        }
        $("#modal").css("display", "none");
    });
}

function changeFrame(op) {
    if (op == 0) {
        // mostrar tabela
        if (!$('#table').is(':visible')) {
            $("#table").toggle();
            atualizaEmpregados();
        }
        $("#form").hide();
    } else {
        // mostrar formulário
        if (!$('#form').is(':visible')) {
            $("#form").toggle();
        }
        $("#table").hide();
    }
}

function onSave() {
    var name = $("#nome").val();
    var salary = parseFloat($("#sal").val());
    if (isNaN(salary)) {
        alert("Digite um valor de salário válido!");
        return;
    }
    var age = parseInt($("#idade").val());
    if (isNaN(age)) {
        alert("Digite uma idade válida!");
        return;
    }
    var avatar = $("#avatar").val();

    var strEmpregado = "{ \"name\":\"" + name + "\",";
    strEmpregado += "\"salary\":\"" + salary + "\",";
    strEmpregado += "\"age\":\"" + age + "\",";
    strEmpregado += "\"profile_image\":\"" + avatar + "\"}";

    var xHttpRequest = new XMLHttpRequest();

    xHttpRequest.onreadystatechange = function () {
        try {
            if (xHttpRequest.readyState === 4) {
                if (xHttpRequest.status === 200) {
                    $("#form .field").val('');
                    changeFrame(0);
                } else {
                    alert("Ocorreu um erro para salvar o empregado!");
                }
            }
        } catch (e) {
            alert('Ocorreu uma exceção: ' + e.description);
        }
    };

    if (formCadastro) { // salva
        xHttpRequest.open('POST', 'http://rest-api-employees.jmborges.site/api/v1/create', true);
        xHttpRequest.setRequestHeader("Content-Type", "application/json");
        xHttpRequest.send(strEmpregado);
    } else { //atualiza
        xHttpRequest.open('PUT', 'http://rest-api-employees.jmborges.site/api/v1/update/' + idEmpregado, true);
        xHttpRequest.setRequestHeader("Content-Type", "application/json");
        xHttpRequest.send(strEmpregado);
    }
}

var formCadastro = true;
var idEmpregado = "";