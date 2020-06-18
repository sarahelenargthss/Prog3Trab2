$(document).ready(function () {
    changeFrame(0);
    atualizaEmpregados();
});

function atualizaEmpregados() {
    $("#table").remove(".empregadoRow");

    var xHttpRequest = new XMLHttpRequest();

    xHttpRequest.onreadystatechange = function () {
        try {
            if (xHttpRequest.readyState === 4) {
                if (xHttpRequest.status === 200) {
                    var empregados = JSON.parse(xHttpRequest.responseText).data;
                    for(var i = 0; i < empregados.length; i++){
                        addEmpregadoLista(empregados[i]);
                    }
                } else {
                    alert("Ocorreu um erro ao fazer a requisição!");
                }
            }
        }catch( e ) {
            alert('Ocorreu uma exceção: ' + e.description);
        }
    };

    xHttpRequest.open('GET', 'http://rest-api-employees.jmborges.site/api/v1/employees', true);
    xHttpRequest.setRequestHeader("Content-Type", "application/json");
    xHttpRequest.send();
}

function addEmpregadoLista(empregado) {
    var id = parseInt(empregado.id);
    var sal = parseFloat(empregado.employee_salary);
    if(isNaN(sal)){
        sal = 0;
    }

    var element = "<tr class=\"empregadoRow\">";
    element += "<td>" + id + "</td>";
    element += "<td>" + String(empregado.employee_name) + "</td>";
    element += "<td> R$ " + sal + "</td>";
    element += "<td>" + String(empregado.employee_age) + "</td>";
    element += "<td><button class=\"colorful\"><a href=\"" + empregado.profile_image + "\")>...</a></button></td>";
    element += "<td> <button class=\"colorful\" onclick=\"editarEmpregado(" + id + ")\">Editar</button>";
    element += "<button class=\"colorful\" onclick=\"excluirEmpregado(" + id + ")\">Excluir</button> </td>";
    element += "</tr>";

    document.getElementById("default_table").insertRow(-1).innerHTML = element;
}

function editarEmpregado(id) {
    alert("editar empregado " + id);
}

function excluirEmpregado(id) {
    alert("excluir empregado " + id);
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
    //valida campos e salva empregado

    if (1) { // se slavou
        $("#form .field").val('');
        changeFrame(0);
    } else {
        //informa erro
    }
}


/*
                <tr>
                    <td class="pais">Rio Grande do Sul (RS)</td>
                    <td>3</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                </tr>*/