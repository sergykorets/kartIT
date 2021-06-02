import React, {Fragment} from 'react';
import { Modal, ModalHeader, FormGroup, Label, Input, ButtonToggle } from 'reactstrap';
import ReactGA from 'react-ga';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import YouTube from 'react-youtube';
import ImageGallery from 'react-image-gallery';

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentDidMount() {
    if (!this.props.admin) {
      ReactGA.initialize('UA-116820611-4');
      ReactGA.ga('send', 'pageview', '/');
    }
  }

  handleClick = (url) => {
    window.location = url;
  };

  handleCheckIn = () => {
    if (this.props.logged) {
      if (window.confirm("Зареєструватися на гонку?")) {
        $.ajax({
          url: '/races/check_in.json',
          type: 'POST'
        }).then((resp) => {
          if (resp.success) {
            NotificationManager.success('Ви успішно записалися на гонку');
          } else {
            NotificationManager.error('Ви вже зареєстровані в гонці', 'Неможливо зробити дію');
          }
        });
      }
    } else {
      NotificationManager.error('Спочатку треба увійти або зареєструватися на сайті', 'Неможливо зробити дію');
    }
  };

  render() {
    const images = [
      {
        original: 'https://static.wixstatic.com/media/729cbe_b810126632a540e7a3a5687db433e60a.jpg/v1/fill/w_1279,h_847,al_c,q_90/729cbe_b810126632a540e7a3a5687db433e60a.webp',
        thumbnail: 'https://static.wixstatic.com/media/729cbe_b810126632a540e7a3a5687db433e60a.jpg/v1/fill/w_1279,h_847,al_c,q_90/729cbe_b810126632a540e7a3a5687db433e60a.webp',
      },
      {
        original: 'https://static.wixstatic.com/media/729cbe_ed941877cb8d47ba801c6b278b47d27a.jpg/v1/fill/w_1279,h_847,al_c,q_90/729cbe_ed941877cb8d47ba801c6b278b47d27a.webp',
        thumbnail: 'https://static.wixstatic.com/media/729cbe_ed941877cb8d47ba801c6b278b47d27a.jpg/v1/fill/w_1279,h_847,al_c,q_90/729cbe_ed941877cb8d47ba801c6b278b47d27a.webp',
      },
      {
        original: 'https://static.wixstatic.com/media/729cbe_0ec1beb7bfeb49d487e811389a36e263.jpg/v1/fill/w_1279,h_847,al_c,q_90/729cbe_0ec1beb7bfeb49d487e811389a36e263.webp',
        thumbnail: 'https://static.wixstatic.com/media/729cbe_0ec1beb7bfeb49d487e811389a36e263.jpg/v1/fill/w_1279,h_847,al_c,q_90/729cbe_0ec1beb7bfeb49d487e811389a36e263.webp',
      },
      {
        original: 'https://static.wixstatic.com/media/79dd75_f649d606549240fab7ee0e73e8b5bbc3.jpg/v1/fill/w_1144,h_762,al_c,q_85,usm_0.66_1.00_0.01/79dd75_f649d606549240fab7ee0e73e8b5bbc3.webp',
        thumbnail: 'https://static.wixstatic.com/media/79dd75_f649d606549240fab7ee0e73e8b5bbc3.jpg/v1/fill/w_1144,h_762,al_c,q_85,usm_0.66_1.00_0.01/79dd75_f649d606549240fab7ee0e73e8b5bbc3.webp',
      },
      {
        original: 'https://static.wixstatic.com/media/79dd75_fdc611b165414e88963c5b931522dd51.jpg/v1/fill/w_683,h_667,al_c,q_85/79dd75_fdc611b165414e88963c5b931522dd51.webp',
        thumbnail: 'https://static.wixstatic.com/media/79dd75_fdc611b165414e88963c5b931522dd51.jpg/v1/fill/w_683,h_667,al_c,q_85/79dd75_fdc611b165414e88963c5b931522dd51.webp',
      },
      {
        original: 'https://static.wixstatic.com/media/79dd75_7ad208842ac34c35a85aac87812a3f91.jpg/v1/fill/w_1144,h_762,al_c,q_85,usm_0.66_1.00_0.01/79dd75_7ad208842ac34c35a85aac87812a3f91.webp',
        thumbnail: 'https://static.wixstatic.com/media/79dd75_7ad208842ac34c35a85aac87812a3f91.jpg/v1/fill/w_1144,h_762,al_c,q_85,usm_0.66_1.00_0.01/79dd75_7ad208842ac34c35a85aac87812a3f91.webp',
      },
      {
        original: 'https://static.wixstatic.com/media/79dd75_51e59631a6574a6a86bb0b873c1382c6.jpg/v1/fill/w_1142,h_761,al_c,q_85,usm_0.66_1.00_0.01/79dd75_51e59631a6574a6a86bb0b873c1382c6.webp',
        thumbnail: 'https://static.wixstatic.com/media/79dd75_51e59631a6574a6a86bb0b873c1382c6.jpg/v1/fill/w_1142,h_761,al_c,q_85,usm_0.66_1.00_0.01/79dd75_51e59631a6574a6a86bb0b873c1382c6.webp',
      },
      {
        original: 'https://static.wixstatic.com/media/79dd75_0fa5ed5cbdcf408f9f42b4607bc617eb.jpg/v1/fill/w_1144,h_644,al_c,q_85,usm_0.66_1.00_0.01/79dd75_0fa5ed5cbdcf408f9f42b4607bc617eb.webp',
        thumbnail: 'https://static.wixstatic.com/media/79dd75_0fa5ed5cbdcf408f9f42b4607bc617eb.jpg/v1/fill/w_1144,h_644,al_c,q_85,usm_0.66_1.00_0.01/79dd75_0fa5ed5cbdcf408f9f42b4607bc617eb.webp',
      },
      {
        original: 'https://static.wixstatic.com/media/79dd75_734f1640eb074f91916d98144da20aba.jpg/v1/fill/w_1144,h_622,al_c,q_85,usm_0.66_1.00_0.01/79dd75_734f1640eb074f91916d98144da20aba.webp',
        thumbnail: 'https://static.wixstatic.com/media/79dd75_734f1640eb074f91916d98144da20aba.jpg/v1/fill/w_1144,h_622,al_c,q_85,usm_0.66_1.00_0.01/79dd75_734f1640eb074f91916d98144da20aba.webp',
      },
      {
        original: 'https://static.wixstatic.com/media/79dd75_da89b07de72746da84454c0ac8035853.jpg/v1/fill/w_1024,h_683,al_c,q_85/79dd75_da89b07de72746da84454c0ac8035853.webp',
        thumbnail: 'https://static.wixstatic.com/media/79dd75_da89b07de72746da84454c0ac8035853.jpg/v1/fill/w_1024,h_683,al_c,q_85/79dd75_da89b07de72746da84454c0ac8035853.webp',
      },
      {
        original: 'https://static.wixstatic.com/media/729cbe_71314fd457204940b64f635a82889750.jpg/v1/fill/w_504,h_334,al_c,q_80,usm_0.66_1.00_0.01/729cbe_71314fd457204940b64f635a82889750.webp',
        thumbnail: 'https://static.wixstatic.com/media/729cbe_71314fd457204940b64f635a82889750.jpg/v1/fill/w_504,h_334,al_c,q_80,usm_0.66_1.00_0.01/729cbe_71314fd457204940b64f635a82889750.webp',
      },
      {
        original: 'https://static.wixstatic.com/media/79dd75_dde10803db5c486e929b16a4e4153603.jpg/v1/fill/w_482,h_725,al_c,lg_1,q_80/79dd75_dde10803db5c486e929b16a4e4153603.webp',
        thumbnail: 'https://static.wixstatic.com/media/79dd75_dde10803db5c486e929b16a4e4153603.jpg/v1/fill/w_482,h_725,al_c,lg_1,q_80/79dd75_dde10803db5c486e929b16a4e4153603.webp',
      },
      {
        original: 'https://sun6-13.userapi.com/zeIqXzDiuGjDJWtM7YT3sgWI8H5EqP06lr0g0Q/aGk2HHuRoCs.jpg',
        thumbnail: 'https://sun6-13.userapi.com/zeIqXzDiuGjDJWtM7YT3sgWI8H5EqP06lr0g0Q/aGk2HHuRoCs.jpg',
      },
      {
        original: 'https://sun6-14.userapi.com/cWp_67iSASJaioiJxizzJtuETUWkpkDBsKkitw/gDFQu9loFWw.jpg',
        thumbnail: 'https://sun6-14.userapi.com/cWp_67iSASJaioiJxizzJtuETUWkpkDBsKkitw/gDFQu9loFWw.jpg',
      },
      {
        original: 'https://sun6-16.userapi.com/299M1ZUrc51-4PUGo_3bJtERASDG6xhN3d3_5Q/zA8kLa4Eses.jpg',
        thumbnail: 'https://sun6-16.userapi.com/299M1ZUrc51-4PUGo_3bJtERASDG6xhN3d3_5Q/zA8kLa4Eses.jpg',
      },
      {
        original: 'https://sun6-19.userapi.com/1RzgURYNUtv03FZFZHn_Rfhsih3WqIZ4mAyqVg/BpWNVDJIhTE.jpg',
        thumbnail: 'https://sun6-19.userapi.com/1RzgURYNUtv03FZFZHn_Rfhsih3WqIZ4mAyqVg/BpWNVDJIhTE.jpg',
      },
      {
        original: 'https://sun6-16.userapi.com/43Y4ZpnSzWr4lULuqdba-qY_4QMMIzEb8BD6NA/SfN1o7VpB1o.jpg',
        thumbnail: 'https://sun6-16.userapi.com/43Y4ZpnSzWr4lULuqdba-qY_4QMMIzEb8BD6NA/SfN1o7VpB1o.jpg',
      },
      {
        original: 'https://sun6-16.userapi.com/q6tcAxYqrHqtISFQTYZ_ms2QRzHZFBA6b3qUCg/WJMPLh8NGvc.jpg',
        thumbnail: 'https://sun6-16.userapi.com/q6tcAxYqrHqtISFQTYZ_ms2QRzHZFBA6b3qUCg/WJMPLh8NGvc.jpg',
      },
      {
        original: 'https://sun6-14.userapi.com/2WfjKx8HWkhd-DEyhQuyxbPguG6VZ6y0nmmY3Q/UV98PsRWAGc.jpg',
        thumbnail: 'https://sun6-14.userapi.com/2WfjKx8HWkhd-DEyhQuyxbPguG6VZ6y0nmmY3Q/UV98PsRWAGc.jpg',
      },
    ];
    return (
      <Fragment>
        <NotificationContainer/>
        <section id="who-are-we" className="who-are-we page">
          <div className="container wow fadeInUp">
            <div className="row">
              <div className="col-sm-5 col-md-6">
                { this.props.banner &&
                  <div className='next-race-banner'>
                    <div className='left'>
                      <h2>
                        { this.props.banner.register.length > 0 ?
                          <a target='_blank' href={this.props.banner.register}>Наступна гонка</a>
                          :
                          <a href='/races/next_race'>Наступна гонка</a>}
                      </h2>
                      <h5>{this.props.banner.circuit}</h5>
                      <h3><b>{this.props.banner.race_date}</b></h3>
                    </div>
                    <div className='right'>
                      { this.props.banner.register.length > 0 ?
                        <a target='_blank' href={this.props.banner.register} className="btn btn-block custom-button">Check-In</a>
                        :
                        <button onClick={() => this.handleCheckIn()} className="btn btn-block custom-button">Check-In</button>}
                    </div>
                  </div>}
              </div>
              <div className="col-sm-7 col-md-6">
                <p>Це - відкритий любительський чемпіонат з картингу серед працівників у сфері ІТ.</p>
                <p>
                  Тут місце для тих хто любить драйв, швидкість і жагу перемог.
                  Саме тут ти можеш тиснути на газ максимально і не боятися йти на обгін.
                </p>
                <p>Сезон чемпіонату складається з 10ти гонок протягом не зимнього періоду.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="services page">
          <div className="container wow fadeInUp">
            <div className="row">
              <div className="col-12 main-heading text-center">
                <h1>Формат гонки</h1>
              </div>
              <div className="service clearfix">
                <div className='row'>
                  <div className="col-sm-4 col-md-5">
                    <span className="service-number">1</span>
                  </div>
                  <div className="col-sm-8 col-md-7">
                    <h2>Практика</h2>
                    <p>Тривалість 15 хв. У заїзді їдуть 10-20 чоловік. Тренувальний заїзд для вивчення треку.
                       На результати етапу цей заїзд не впливає, окрім як можливості встановлення найкращого часу кола
                       взагалом протягом всього етапу.</p>
                  </div>
                </div>
              </div>

              <div className="service clearfix">
                <div className='row'>
                  <div className="col-sm-4 col-md-5">
                    <span className="service-number">2</span>
                  </div>
                  <div className="col-sm-8 col-md-7">
                    <h2>Кваліфікація</h2>
                    <p>Тривалість 10 хв. У заїзді їдуть 10-20 чоловік. З усіх кругів, які проїдуть "пілоти" береться лише найкраще.
                       Кваліфікація встановлює порядок стартової решітки гонок півфіналів.</p>
                  </div>
                </div>
              </div>

              <div className="service clearfix">
                <div className='row'>
                  <div className="col-sm-4 col-md-5">
                    <span className="service-number">3</span>
                  </div>
                  <div className="col-sm-8 col-md-7">
                    <h2>Півфінал</h2>
                    <p>Заїзди в гоночному режимі по результатам кваліфікації. Хто вище в кваліфікації, той має кращу стартову позицію.
                       Старт гонки відбуваться з місця, кількість гонок залежить від кількості учасників.
                       Кількість учасників в окремому заїзді 10-20. Тривалість гонки - 12 кругів (10 хв).</p>
                  </div>
                </div>
              </div>

              <div className="service clearfix">
                <div className='row'>
                  <div className="col-sm-4 col-md-5">
                    <span className="service-number">4</span>
                  </div>
                  <div className="col-sm-8 col-md-7">
                    <h2>Фінал</h2>
                    <p>Кількість пілотів - 10-15. Формується з пілотів, які зайняли вищі позиції в півфіналах.
                       Стартова решітка фіналу формується за результатами півфіналів:
                       Перше місце на старті має той пілот, який виграв півфінал і показав найкраще коло серед переможців
                       інших півфіналів. Всі інші місця стартової решітки формуються за такою ж схемою.
                       Всі фіналісти доважуються до ваги 90 кг. Тривалість гонки - 15 кругів (12 хв).</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="cta" className="cta page">
          <div className="container wow fadeInUp">
            <div className="row">
              <div className="col-sm-6">
                <h1>Цікаво?</h1>
              </div>
              <div className="col-sm-6">
                <button onClick={() => this.handleClick('/users/sign_up')} className="btn btn-block custom-button">Стати гонщиком</button>
              </div>
            </div>
          </div>
        </section>

        <section className="services page">
          <div className="container wow fadeInUp">
            <div className="col-12 main-heading text-center">
              <h1>Галерея</h1>
            </div>
            <hr/>
            <div className='text-center'>
              <YouTube videoId='TJsbiukOytg' />
            </div>
            <hr/>
            <div className='gallery'>
              <ImageGallery items={images} autoPlay showThumbnails={false}/>
            </div>
          </div>
        </section>
      </Fragment>
    );
  }
}
