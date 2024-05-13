const express = require('express');
const path = require('path');

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountsKeys.json");

/*---------INITIALIZING-------*/
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  }); 
const db = admin.firestore()
/*---------INITIALIZING-------*/

const app = express();
const port = 3000;
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.static('css'));


app.get('/check_primary_payment', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'check_payment', 'check_payment.html'));
});
app.use('/check_primary_payment', express.static(path.join(__dirname, 'public', 'check_payment')));

app.get('/test-one', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'test_one', 'test_one.html'));
  });
app.use('/test-one', express.static(path.join(__dirname, 'public', 'test_one')));

app.get('/test-two', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'test_two', 'test_two.html'));
  });
app.use('/test-two', express.static(path.join(__dirname, 'public', 'test_two')));

app.get('/session-register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'session_register', 'session_sign_up.html'));
  });
app.use('/session-register', express.static(path.join(__dirname, 'public', 'session_register')));


app.get('/aOUVdbbidP7b', (req, res) => { //!ВИДЕО 1
    res.sendFile(path.join(__dirname, 'public', 'video_one', 'video.html'));
  });
app.use('/aOUVdbbidP7b', express.static(path.join(__dirname, 'public', 'video_one')));

app.get('/fminiIBUv87bui', (req, res) => { //!ВИДЕО 2
    res.sendFile(path.join(__dirname, 'public', 'video_two', 'video.html'));
  });
app.use('/fminiIBUv87bui', express.static(path.join(__dirname, 'public', 'video_two')));

app.get('/hiYB8ygibrgg', (req, res) => { //!ВИДЕО 3 - pro
  res.sendFile(path.join(__dirname, 'public', 'video_three_pro', 'video.html'));
});
app.use('/hiYB8ygibrgg', express.static(path.join(__dirname, 'public', 'video_three_pro')));

app.get('/amfjxu9HInd', (req, res) => { //!ВИДЕО БОНУС
  res.sendFile(path.join(__dirname, 'public', 'video_bonus', 'video.html'));
});
app.use('/amfjxu9HInd', express.static(path.join(__dirname, 'public', 'video_bonus')));




app.post("/check-user-primary-payment", async (req, res) => {
  const { userEmailOrPhone, paymentStep } = req.body
  const clearedEmail = userEmailOrPhone.toLowerCase().trim();

  await findUserPrimaryPayment(clearedEmail)
  .then(data => {
      if (data.error) {
          res.send({
              data: "error"
          })
      } else {
          res.send({
              data: {
                  result: "success",
                  userEmail: clearedEmail,
                  userPhone: data.userPhone,
                  userName: data.userName,
                  paymentPrice: data.paymentPrice,
                  productId: data.productId
              }
          })
          try {
            deleteDocument(clearedEmail)
          } catch (error) {
            console.error(error);
            deleteDocument(userEmailOrPhone)
          }
      }
  })
})


//!НЕ ТРОГАТЬ
app.post('/webhook', async (req, res) => {
  const webhookKeyFromHeaders = req.headers['webhook-key'];
  
  if (webhookKeyFromHeaders !== "9187CC74AD93C42A2A101E147095919A093F07CE334638BABBD620B21F089A46") {
    console.error("Invalid webhook key.");
    return res.status(401).send("Invalid webhook key.");
  } else {
    const webhookData = req.body;
    const userName = webhookData.customer_name || "none" 
    const userPhone = webhookData.customer_phone || "none"
    const userEmail = webhookData.customer_email || "none"
    const productId = webhookData.product_id || "none"
    const paymentPrice = webhookData.total_amount || "none"

    await addUserAfterPaymentToFirestore(`${userEmail}`, `${userName}`, `${userPhone}`, `${paymentPrice}`, `${productId}`)


    res.status(200).send("Webhook processed successfully.");
  }
});

async function addUserAfterPaymentToFirestore(userEmail, userName, userPhone, paymentPrice, productId) {
  const db = admin.firestore();

  try {
    // Создаем документ с названием userEmail
    const userDocRef = db.collection('paymentKeys').doc(userEmail);

    // Добавляем поля в документ
    await userDocRef.set({
      userName: userName || "none",
      userPhone: userPhone || "none",
      paymentPrice: paymentPrice || "none",
      productId: productId || "none"
    });
    
    console.log(`Пользователь успешно добавлен в Firestore: ${userEmail}`);
    return true;
  } catch (error) {
    console.error('Ошибка при добавлении пользователя в Firestore:', error);
    return false;
  }
}





app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});






//!ФУНКЦИИ БАЗЫ ДАННЫХ
async function findUserPrimaryPayment(userEmail) {
  const db = admin.firestore();

  try {
      // Получаем данные из коллекции paymentKeys
      const snapshot = await db.collection('paymentKeys').doc(userEmail).get();

      // Проверяем, существует ли документ с указанным userEmail
      if (snapshot.exists) {
          // Возвращаем все поля и значения данного документа
          return snapshot.data();
      } else {
          // Если документ не найден, возвращаем соответствующее сообщение или значение
          return {
              error: 'Документ не найден'
          };
      }
  } catch (error) {
      // Обработка ошибок, если что-то пошло не так
      console.error('Ошибка при получении данных из БД:', error);
      return {
          error: 'Произошла ошибка при получении данных из БД'
      };
  }
}

async function deleteDocument(userEmail) {
  const db = admin.firestore();

  try {
    // Ссылка на документ в Firestore
    const docRef = db.collection('paymentKeys').doc(String(userEmail)); // Замените 'yourCollectionName' на имя вашей коллекции

    // Удаление документа
    await docRef.delete();

    console.log(`Документ с userEmail "${userEmail}" успешно удален.`);
  } catch (error) {
    console.error('Ошибка при удалении документа:', error);
  }
}