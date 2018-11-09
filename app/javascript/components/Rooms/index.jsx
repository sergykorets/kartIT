import React, {Fragment} from 'react';
import {NotificationContainer, NotificationManager} from 'react-notifications';

export default class Rooms extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hotelId: this.props.hotelId,
      rooms: this.props.rooms,
      flash: this.props.flash
    };
  }

  componentDidMount() {
    if (this.state.flash) {
      NotificationManager.error(this.state.flash, 'Неможливо перейти на сторінку')
    }
  }

  handleRoomChange = (field, i, value) => {
    this.setState({
      rooms: {
        ...this.state.rooms,
        [i]: {
          ...this.state.rooms[i],
          [field]: value
        }
      }
    })
  }

  addRoom = () => {
    this.setState({
      rooms: {
        ...this.state.rooms,
        [(+ new Date())]: {number: '', floor: '', places: ''}
      }
    })
  }

  deleteRoom = (i) => {
    if (confirm('Видалити даний номер?')) {
      if (this.state.rooms[i].id) {
        $.ajax({
          url: `/hotels/${this.state.hotelId}/rooms/${i}.json`,
          type: 'DELETE'
        }).then((resp) => {
          if (resp.success) {
            this.setState({rooms: resp.rooms});
            NotificationManager.success('Номер видалено')
          } else {
            resp.errors.map((error, index) => NotificationManager.error(error, 'Неможливо видалити'))
          }
        });
      } else {
        let items = this.state.rooms
        delete items[i]
        this.setState({rooms: items});
      }
    }
  }

  handleSubmit = () => {
    $.ajax({
      url: `/hotels/${this.state.hotelId}.json`,
      type: 'PATCH',
      data: {
        hotel: {
          id: this.state.hotelId,
          rooms_attributes: this.state.rooms
        }
      }
    }).then((resp) => {
      if (resp.success) {
        NotificationManager.success('Зміни збережено')
      } else {
        resp.errors.map((error, index) => NotificationManager.error(error, 'Неможливо створити'))
      }
    });
  }

  render() {
    console.log('Rooms', this.state)
    return (
      <div className="container">
        <NotificationContainer/>
        <h3 className='text-center'>Створення номерів в готелі</h3>
        <div className='form-group'>
          <i className='fa fa-plus btn btn-info' onClick={this.addRoom}> Додати номер</i>
        </div>
        <hr/>
        <div className='row'>
          { Object.keys(this.state.rooms).map((i) => {
            const room = this.state.rooms[i]
            if (!room._destroy) {
              return (
                <div key={i} className="room col-lg-2">
                  <i className='fa fa-trash-o float-right' onClick={() => this.deleteRoom(i)} />
                  <label>Номер</label>
                  <input type="number" min={1} className='form-control' value={room.number} onChange={(e) => this.handleRoomChange('number', i, e.target.value)} />
                  <label>Поверх</label>
                  <input type="number" min={1} className='form-control' value={room.floor} onChange={(e) => this.handleRoomChange('floor', i, e.target.value)} />
                  <label>Кількість місць</label>
                  <input type="number" min={1} className='form-control' value={room.places} onChange={(e) => this.handleRoomChange('places', i, e.target.value)} />
                </div>
              )}})}
        </div>
        <hr/>
        <div className='form-group'>
          <button className='btn btn-dark' onClick={this.handleSubmit}>Зберегти</button>
        </div>
      </div>
    );
  }
}