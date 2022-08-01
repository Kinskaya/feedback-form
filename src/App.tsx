import { useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';

import './style.scss';

interface IFormInput {
  id?: number;
  fullName: string;
  email: string;
  phone: string;
  birthday: string;
  message: string;
}

function App() {
  const [resMessage, setResMessage] = useState('');

  const {
    register,
    formState: {errors, isValid, isSubmitSuccessful},
    handleSubmit,
    reset,
  } = useForm<IFormInput>({
    mode: "onBlur",
  });

  const message = {
    success: 'Форма успешно отправлена',
    error: 'Что-то пошло не так, попробуйте еще раз'
  }

  const postData = async (url: string, data: IFormInput) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(message.error);
    }
    return await response.json();
  }

  const onSubmit = (data: IFormInput) => {
    console.log(data)
    postData('http://localhost:3000/forms/', data)
        .then(res => {
          if (!res.ok) {
            setResMessage(message.error);
          }
          setResMessage(message.success);
        })
        .catch(() => setResMessage(message.error));
  }
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        fullName: '',
        email: '',
        phone: '',
        birthday: '',
        message: '',
      });
    }
  }, [isSubmitSuccessful, reset]);

  const currentDate = new Date().toISOString().slice(0, 10);

  return (
    <div className="app">
      <h1>Форма обратной связи</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate >
        <label>
          Имя Фамилия:
          <input type="text" {...register("fullName", {
            required: 'Пожалуйста, введите имя и фамилию на латинице',
            pattern: /[a-zA-Z]{3,30}\s[a-zA-Z]{3,30}/,
            minLength: {
            value: 3,
              message: 'Минимум 3 символа',
            },
            maxLength: {
            value: 30,
              message: 'Максимум 30 символов',
            }
          })} />
        </label>
        <div>
          {errors?.fullName && <p>{errors?.fullName?.message
          || 'Поле должно содержать имя и фамилию на латинице, от 3 до 30 символов для каждого значения.'}</p>}
        </div>
        <label>
          E-mail:
          <input type="email" {...register("email", { pattern: /\w+@\w+\.\w+/,
            required: 'Пожалуйста, введите email'})} />
        </label>
        <div>
          {errors?.email && <p>{errors?.email?.message || 'Пожалуйста, введите корректный email-адрес'}</p>}
        </div>
        <label>
          Номер телефона:
          <input type="tel" placeholder="+7-xxx-xxx-xx-xx" { ...register("phone", {
            required: 'Пожалуйста, введите номер телефона',
            pattern: /\+7-[0-9]{3}-[0-9]{3}-[0-9]{2}-[0-9]{2}/,
            })} />
        </label>
        <div>
          {errors?.phone && <p>{errors?.phone?.message || 'Пожалуйста, введите номер в формате: +7-xxx-xxx-xx-xx'}</p>}
        </div>
        <label>
          Дата рождения:
          <input type="date" { ...register("birthday", {
            required: 'Пожалуйста, введите дату рождения'})} max={currentDate}/>
        </label>
        <div>
          {errors?.birthday && <p>{errors?.birthday?.message}</p>}
        </div>
        <label>
          Сообщение:
          <textarea {...register("message", { required: 'Пожалуйста, введите сообщение',
            minLength: {
            value: 10,
              message: 'Минимум 10 символов',
            },
            maxLength: {
            value: 300,
              message: 'Максимум 300 символов',
            }
          })} />
        </label>
        <div>
          {errors?.message && <p>{errors?.message?.message}</p>}
        </div>
        <input type="submit" disabled={!isValid}/>
      </form>
      <div className="message"><h3>{resMessage}</h3></div>
    </div>
  );
}

export default App;
