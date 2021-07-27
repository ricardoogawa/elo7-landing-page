class HttpService {
  constructor(url, method) {
    this.url = url;
    this.method = method;
  }

  request() {
    try {
      return new Promise((resolve, reject) => {
        let http = new XMLHttpRequest();
        http.open(this.method, this.url, true);
        http.onload = function () {
          var status = http.status;
          if (status >= 200 && status <= 299) {
            resolve({
              status: status,
              message: "Sucesso",
              data: http.response,
            });
          } else {
            reject({ status: status, message: http.response });
          }
        };
        http.send();
      });
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}

class VagasModel {
  constructor() {}

  async loadData() {
    try {
      let http = new HttpService(
        "http://www.mocky.io/v2/5d6fb6b1310000f89166087b",
        "GET"
      );
      let result = await http.request();

      return result.data;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  async getAll() {
    try {
      let result = await this.loadData();
      let data = JSON.parse(result);

      return data;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}

class VagasViewModel {
  vagas = [];

  constructor() {}

  async getVagasAtivas() {
    try {
      const vagas = new VagasModel();
      const result = await vagas.getAll();

      return result.vagas.filter((data) => data.ativa === true);
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}

class VagasView {
  vagas = [];

  constructor() {
      this.render();
  }

  async render() {
    const data = new VagasViewModel();
    this.vagas = await data.getVagasAtivas();

    let quantidade_vagas = this.vagas.length;

    if (quantidade_vagas) {
        let html = '';

        for (let i = 0; i < quantidade_vagas; i++) {
            html += `<a rel="external nofollow" href="${this.vagas[i].link}" target="blank" class="flex-item vagas">
                <div class="title text-center">
                    <h4>${this.vagas[i].cargo}</h4>
                </div>
                <div class="content text-center">
                    <p>${this.vagas[i].localizacao ? this.vagas[i].localizacao.bairro + ', ' + this.vagas[i].localizacao.cidade + ' - ' + this.vagas[i].localizacao.pais : 'Remoto'}</p>
                </div>
            </a>`;
        }

        document.getElementById('vagas-item').innerHTML = html;
    }
  }
}

new VagasView();
