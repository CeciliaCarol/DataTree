class Node {
    constructor(data) {
      this.data = data;
      this.left = null;
      this.right = null;
    }
  }

  class BST {
    constructor() {
      this.root = null;
    }

    inserir(data) {
      const novoNode = new Node(data);
      if (this.root === null) {
        this.root = novoNode;
      } else {
        this.inserirNode(this.root, novoNode);
      }
    }

    inserirNode(node, novoNode) {
      if (novoNode.data.nome < node.data.nome) {
        if (node.left === null) {
          node.left = novoNode;
        } else {
          this.inserirNode(node.left, novoNode);
        }
      } else {
        if (node.right === null) {
          node.right = novoNode;
        } else {
          this.inserirNode(node.right, novoNode);
        }
      }
    }

    buscarPorNome(node, nome) {
      if (node === null) {
        return null;
      }

      const nomeTabela = node.data.nome;
      if (nomeTabela === nome) {
        return node.data.tabela;
      } else if (nome < nomeTabela) {
        return this.buscarPorNome(node.left, nome);
      } else {
        return this.buscarPorNome(node.right, nome);
      }
    }

    toString(node = this.root) {
      if (node === null) {
        return [];
      }

      const esquerda = this.toString(node.left);
      const direita = this.toString(node.right);

      return [...esquerda, node.data, ...direita];
    }
  }

  class Registro {
    constructor(valores) {
      this.valores = valores;
    }
  }

  class Tabela {
    constructor(nome, colunas, chavePrimaria) {
      this.nome = nome;
      this.colunas = colunas;
      this.chavePrimaria = chavePrimaria;
      this.registros = [];
    }
  }

  const bancoDeDados = new BST();

  function criarTabela() {
    const nomeTabela = document.getElementById('tableName').value;
    const colunas = document.getElementById('columns').value.split(',');
    const chavePrimaria = document.getElementById('primaryKey').value;

    if (!nomeTabela || !colunas || !chavePrimaria) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    const tabela = new Tabela(nomeTabela, colunas, chavePrimaria);
    bancoDeDados.inserir({ nome: nomeTabela, tabela: tabela });
    atualizarDropdownTabelas();
  }

  function inserirRegistro() {
    const nomeTabelaSelect = document.getElementById('insertTableName');
    const nomeTabela = nomeTabelaSelect.value;
    const valoresInput = document.getElementById('recordValues');
    const valores = valoresInput.value.split(',');

    const tabela = bancoDeDados.buscarPorNome(bancoDeDados.root, nomeTabela);

    if (!nomeTabela || !valores || !tabela) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    // Verificar se o número de valores coincide com o número de colunas
    if (valores.length !== tabela.colunas.length) {
      alert('O número de valores deve ser igual ao número de colunas.');
      return;
    }

    // Verificar se a chave primária já existe
    const indiceChavePrimaria = tabela.colunas.indexOf(tabela.chavePrimaria);
    const valorChavePrimaria = valores[indiceChavePrimaria];
    const chavePrimariaExiste = tabela.registros.some(registro => registro.valores[indiceChavePrimaria] === valorChavePrimaria);

    if (chavePrimariaExiste) {
      alert('A chave primária já existe na tabela.');
      return;
    }

    tabela.registros.push(new Registro(valores));
    atualizarConteudoDoBanco();
  }

  function editarRegistro() {
    const nomeTabelaSelect = document.getElementById('editTableName');
    const nomeTabela = nomeTabelaSelect.value;
    const indiceRegistro = document.getElementById('editRecordSelect').value;
    const valoresInput = document.getElementById('editRecordValues');
    const novosValores = valoresInput.value.split(',');

    const tabela = bancoDeDados.buscarPorNome(bancoDeDados.root, nomeTabela);

    if (!nomeTabela || !indiceRegistro || !novosValores || !tabela) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    const registro = tabela.registros[indiceRegistro];

    if (!registro) {
      alert('Selecione um registro válido para editar.');
      return;
    }

    if (novosValores.length !== tabela.colunas.length) {
      alert('O número de novos valores deve ser igual ao número de colunas.');
      return;
    }

    // Aplicar as alterações aos valores do registro
    for (let i = 0; i < novosValores.length; i++) {
      registro.valores[i] = novosValores[i];
    }

    // Atualizar o conteúdo do banco
    atualizarConteudoDoBanco();
    atualizarDropdownRegistros();
    atualizarDropdownTabelas();
  }

  function mostrarTabela() {
    const headerRow = document.getElementById('headerRow');
    const conteudoDoBanco = document.getElementById('dataRows');

    // Limpar conteúdo
    headerRow.innerHTML = '';
    conteudoDoBanco.innerHTML = '';

    // Obter nome da tabela selecionada
    const nomeTabela = document.getElementById('insertTableName').value;
    const tabela = bancoDeDados.buscarPorNome(bancoDeDados.root, nomeTabela);

    if (!tabela) {
      alert('Selecione uma tabela válida.');
      return;
    }

    // Adicionar cabeçalho
    const thRow = document.createElement('tr');
    tabela.colunas.forEach(coluna => {
      const th = document.createElement('th');
      th.textContent = coluna;
      
      // Adicionar classe "primaryKey" para a célula da chave primária
      if (coluna === tabela.chavePrimaria) {
        th.classList.add('primaryKey');
      }

      thRow.appendChild(th);
    });
    headerRow.appendChild(thRow);

    // Adicionar dados
    tabela.registros.forEach(registro => {
      const tr = document.createElement('tr');
      registro.valores.forEach(valor => {
        const td = document.createElement('td');
        td.textContent = valor;
        tr.appendChild(td);
      });
      conteudoDoBanco.appendChild(tr);
    });
  }

  function atualizarDropdownTabelas() {
    const nomeTabelaSelect = document.getElementById('insertTableName');
    nomeTabelaSelect.innerHTML = '';

    const tabelas = bancoDeDados.toString();
    tabelas.forEach(tabela => {
      const [nomeTabela] = tabela.nome.split(',');
      const option = document.createElement('option');
      option.value = nomeTabela;
      option.textContent = nomeTabela;
      nomeTabelaSelect.appendChild(option);
    });
  }

  function atualizarConteudoDoBanco() {
    // Esta função permanece praticamente a mesma, pois já foi ajustada para funcionar com as novas alterações.
    const conteudoDoBanco = document.getElementById('dataRows');
    const tableNameHeader = document.getElementById('tableNameHeader');
    const nomeTabela = document.getElementById('insertTableName').value;
    const tabela = bancoDeDados.buscarPorNome(bancoDeDados.root, nomeTabela);
    const numColunas = tabela ? tabela.colunas.length : 1;

    // Limpar conteúdo
    conteudoDoBanco.innerHTML = '';

    // Adicionar nome da tabela ao cabeçalho
    tableNameHeader.textContent = `Nome da Tabela: ${nomeTabela}`;

    // Adicionar dados
    tabela.registros.forEach(registro => {
      const row = document.createElement('tr');
      registro.valores.forEach(valor => {
        const cell = document.createElement('td');
        cell.textContent = valor;
        row.appendChild(cell);
      });
      conteudoDoBanco.appendChild(row);
    });
  }
  
  function editarRegistro() {
      const nomeTabelaSelect = document.getElementById('insertTableName');
    const nomeTabela = nomeTabelaSelect.value;
    const valoresInput = document.getElementById('recordValues');
    const novosValores = valoresInput.value.split(',');

    const tabela = bancoDeDados.buscarPorNome(bancoDeDados.root, nomeTabela);

    if (!nomeTabela || !novosValores || !tabela) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    const conteudoDoBanco = document.getElementById('dataRows');

    // Encontrar a linha correspondente ao registro
    const dataRows = conteudoDoBanco.children;
    const rowIndex = Array.from(dataRows).findIndex(row => row.cells[0].textContent === novosValores[0]);

    if (rowIndex !== -1) {
      // Atualizar as células da linha com os novos valores
      novosValores.forEach((value, index) => {
        dataRows[rowIndex].cells[index].textContent = value;
      });

      console.log(`Editando registro na tabela ${nomeTabela} com novos valores: ${novosValores}`);
    }
  }
  
  function excluirRegistro() {
    const nomeTabelaSelect = document.getElementById('insertTableName');
    const nomeTabela = nomeTabelaSelect.value;
    const valoresInput = document.getElementById('recordValues');
    const valores = valoresInput.value.split(',');

    const tabela = bancoDeDados.buscarPorNome(bancoDeDados.root, nomeTabela);

    if (!nomeTabela || !valores || !tabela) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    const conteudoDoBanco = document.getElementById('dataRows');

    // Encontrar o índice do registro com base nos valores
    const rowIndex = getRowIndexByValues(conteudoDoBanco, tabela, valores);

    if (rowIndex !== -1) {
      // Remover a linha correspondente ao registro
      conteudoDoBanco.deleteRow(rowIndex);

      console.log(`Excluindo registro na tabela ${nomeTabela} com valores: ${valores}`);
    }
  }

  function getRowIndexByValues(tableBody, tabela, valores) {
    // Obter todas as linhas da tabela
    const dataRows = Array.from(tableBody.children);

    // Encontrar o índice da linha correspondente aos valores fornecidos
    const rowIndex = dataRows.findIndex(row => {
      // Comparar os valores da chave primária na linha com os valores fornecidos
      const primaryKeyIndex = tabela.colunas.indexOf(tabela.chavePrimaria);
      return row.cells[primaryKeyIndex].textContent === valores[primaryKeyIndex];
    });

    return rowIndex;
  }