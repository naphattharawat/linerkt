import { Line } from './../models/line';
import * as express from 'express';
import { Router, Request, Response } from 'express';
import { Jwt } from '../models/jwt';
import * as HttpStatus from 'http-status-codes';

const jwt = new Jwt();
const line = new Line();

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send({ ok: true, message: 'Welcome to RESTful api server!', code: HttpStatus.OK });
});
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const db = req.db;
    if (req.body.events.length) {
      let replyToken = req.body.events[0].replyToken
      const event = req.body.events[0];
      // memberLeft
      if (event.type == 'memberJoined') {
        console.log(event.source.groupId);
        console.log(event.joined.members[0].userId);

        const rs: any = await line.getProfileInGroup(event.source.groupId, event.joined.members[0].userId);
        await line.replyMessage(replyToken, [
          {
            "type": "text",
            "text": `ยินดีต้อนรับคุณ ${rs.displayName} สู่กลุ่มช่วยเหลือรร.วัดระฆังทอง ในวันที่ 21-23 ตุลาคม 66 รายละเอียดเพิ่มเติมจะแจ้งให้ทราบอีกครั้งนึงครับ`
          },
          {
            "type": "text",
            "text": "เข้ากลุ่มใหม่รบกวนแจ้งข้อมูลด้วยครับ"
          },
          {
            "type": "text",
            "text": "ชื่อเล่น : \nอายุ : \nเดินทางมาจาก จ. : \nเบอร์ติดต่อ : \nผู้ติดตามจำนวน : \n การเดินทาง : รถเก๋ง/รถกระบะ/มอเตอร์ไซค์\nทะเบียนรถ : \nเครื่องมือ/อุปกรณ์/สิ่งของ ที่จะนำไปด้วย : \nอาหารที่แพ้ : \nโรคประจำตัว : \nทราบข่าวจากที่ไหน : \nไป-กลับ/พักที่โรงเรียน/จองห้องพักเอง(กรุณาบอกชื่อที่พัก) :  "
          }
        ])
      } else if (event.type == 'follow') {
        await line.replyMessage(replyToken,
          [
            {
              "type": "text",
              "text": "กรุณาติดต่อในกลุ่มเท่านั้นครับ"
            }
          ])
      }
      // console.log(event.type);
      // console.log(event);

      // if (event.type == 'follow') {
      //   console.log(`follow - ${event.destination}`);
      // } else if (event.type === 'message') {
      //   const text = event.message.text;
      //   let messages = [];
      //   if (event.message.type == 'text') {
      //     if (text.substr(0, 3) == 'add') {
      //       addMessage(db, text);
      //     } else if (text.substr(0, 7) == 'useQ4U=' || text.substr(0, 7) == 'useq4u=') {
      //       const hospcode = text.substr(7, text.length - 7);
      //       const hc = await line.getHospital(db, hospcode);
      //       if (hc.length) {
      //         messages.push({ type: 'text', text: `ขอบคุณ ${hc[0].hosname} ที่ใช้ Q4U` });
      //         await line.saveQ4U(db, { 'hospcode': hospcode });
      //       }
      //     } else {
      //       const rs = await line.getMessage(db, text);
      //       if (rs.length) {
      //         for (const i of rs) {
      //           if (i.reply.substr(0, 4) == "IMG=") {
      //             const img = i.reply.substr(4, i.reply.length - 4);
      //             messages.push({ type: 'image', originalContentUrl: img, previewImageUrl: img });
      //           } else {
      //             const _i = i.reply.replace(/##/g, '\r\n');
      //             messages.push({ type: 'text', text: _i });
      //           }
      //         }
      //         messages.push({ type: 'text', text: '################\r\nรพ.ไหนใช้ Q4U แล้ว รบกวนพิมพ์ \r\nuseQ4U=xxxxx (hospcode) \r\nเพื่อเก็บข้อมูลเสนอผู้บริหารครับ\r\n################' });
      //       }
      //     }
      //     if (messages.length) {
      //       await line.replyMessage(replyToken, messages)
      //     }

      //   }
      // }
    }

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(200);

  }
});

async function addMessage(db, text) {
  const _text = text.split(',');
  if (_text[0] == 'add') {
    const p = _text[1].substr(2, _text[1].length - 2);
    const r = _text[2].substr(2, _text[2].length - 2);
    const obj = {
      pattern: p,
      reply: r
    }
    await line.saveMessage(db, obj)
  }
}

export default router;