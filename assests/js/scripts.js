document.addEventListener('DOMContentLoaded', () => {
    let productCount = 1;
    let attachmentCount = 1;

    document.getElementById('cep').addEventListener('blur', () => {
        const cep = document.getElementById('cep').value.replace(/\D/g, '');
        if (cep !== '') {
            const validacep = /^[0-9]{8}$/;
            if (validacep.test(cep)) {
                fetch(`https://viacep.com.br/ws/${cep}/json/`)
                    .then(response => response.json())
                    .then(data => {
                        if (!data.erro) {
                            document.getElementById('endereco').value = data.logradouro;
                            document.getElementById('bairro').value = data.bairro;
                            document.getElementById('municipio').value = data.localidade;
                            document.getElementById('estado').value = data.uf;
                        } else {
                            alert('CEP não encontrado.');
                        }
                    })
                    .catch(() => alert('Erro ao consultar o CEP.'));
            } else {
                alert('Formato de CEP inválido.');
            }
        }
    });

    document.getElementById('supplierForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const products = [];
        const attachments = [];

        for (let i = 1; i <= productCount; i++) {
            const product = {
                nome: formData.get(`produto-${i}-nome`),
                unidade: formData.get(`produto-${i}-unidade`),
                quantidade: formData.get(`produto-${i}-quantidade`),
                valorUnitario: formData.get(`produto-${i}-valor-unitario`),
                valorTotal: formData.get(`produto-${i}-quantidade`) * formData.get(`produto-${i}-valor-unitario`),
            };
            products.push(product);
        }

        for (let i = 1; i <= attachmentCount; i++) {
            const fileInput = document.getElementById(`documento-anexo-${i}`);
            if (fileInput && fileInput.files[0]) {
                const file = fileInput.files[0];
                attachments.push(file);
            }
        }

        const jsonData = {
            razaoSocial: formData.get('razaoSocial'),
            cnpj: formData.get('cnpj'),
            nomeFantasia: formData.get('nomeFantasia'),
            inscricaoEstadual: formData.get('inscricaoEstadual'),
            cep: formData.get('cep'),
            endereco: formData.get('endereco'),
            numero: formData.get('numero'),
            complemento: formData.get('complemento'),
            bairro: formData.get('bairro'),
            municipio: formData.get('municipio'),
            estado: formData.get('estado'),
            nomeContato: formData.get('nomeContato'),
            telefone: formData.get('telefone'),
            email: formData.get('email'),
            produtos: products,
            anexos: attachments,
        };

        console.log('JSON de envio:', JSON.stringify(jsonData, null, 2));

        document.getElementById('loadingModal').style.display = 'block';

        setTimeout(() => {
            document.getElementById('loadingModal').style.display = 'none';
            alert('Dados enviados com sucesso!');
        }, 2000);
    });

    document.querySelector('#loadingModal .close').addEventListener('click', () => {
        document.getElementById('loadingModal').style.display = 'none';
    });
});
