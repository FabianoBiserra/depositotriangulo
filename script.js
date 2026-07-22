const form = document.getElementById('form-orcamento');
const resultado = document.getElementById('resultado-envio');
const btnEnviar = document.getElementById('btn-enviar');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const emailInput = document.getElementById('email').value.trim();
    const telefoneInput = document.getElementById('telefone').value.trim();

    // 1. Validação de E-mail via Regex
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(emailInput)) {
        resultado.style.display = "block";
        resultado.className = "erro";
        resultado.textContent = "❌ Por favor, digite um endereço de e-mail válido.";
        return;
    }

    // 2. Validação rigorosa de Telefone (Apenas números, DDD válido de 11 a 99, e 10 ou 11 dígitos)
    // Remove qualquer caractere que não seja número para contar os dígitos limpos
    const apenasNumeros = telefoneInput.replace(/\D/g, '');
    
    // Regex valida: DDD (11-99) seguido de 8 dígitos (fixo) ou 9 dígitos (celular começando com 9)
    const regexTelefoneEstrutura = /^[1-9]{2}(?:[2-8]|9[1-9])[0-9]{3}[0-9]{4}$/;

    if (!regexTelefoneEstrutura.test(apenasNumeros)) {
        resultado.style.display = "block";
        resultado.className = "erro";
        resultado.textContent = "❌ Digite um telefone válido com DDD (Ex: 11988887777 ou 1141271939). Apenas números, sem letras.";
        return;
    }
    
    // Se passar pelas validações, prossegue com o envio via Web3Forms
    btnEnviar.textContent = "Enviando mensagem...";
    btnEnviar.disabled = true;

    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    resultado.style.display = "block";
    resultado.className = "";
    resultado.textContent = "Aguarde, enviando sua solicitação...";

    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: json
    })
    .then(async (response) => {
        let jsonResponse = await response.json();
        if (response.status == 200) {
            resultado.className = "sucesso";
            resultado.textContent = "✅ Mensagem enviada com sucesso! Retornaremos o contato em breve.";
            form.reset();
        } else {
            resultado.className = "erro";
            resultado.textContent = "❌ " + (jsonResponse.message || "Ocorreu um erro ao enviar. Tente novamente.");
        }
    })
    .catch(error => {
        resultado.className = "erro";
        resultado.textContent = "❌ Erro de conexão. Verifique sua internet ou chame diretamente no WhatsApp!";
    })
    .then(() => {
        btnEnviar.textContent = "Solicitar Orçamento Agora";
        btnEnviar.disabled = false;
    });
});