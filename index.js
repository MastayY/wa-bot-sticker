const { Client, LocalAuth, MessageMedia, Contact, MessageTypes } = require('whatsapp-web.js');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const qrcode = require('qrcode-terminal');
const { getGreeting, tanggal } = require('./function.js')
// const keep_alive = require('./keep_alive.js');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        // headless: true,
        // args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-extensions']
        executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('message', async (msg) => {
    if (msg.timestamp + (60000) < Date.now()) {
        try {
            if(msg.body.startsWith(".s") || msg.body.startsWith(".sticker")) {
                if(msg.hasMedia) {
                    msg.react("🔄️");

                    if (msg.type === 'image') {
                        const media = await msg.downloadMedia() .catch((err) => {
                            console.error(err);
                            client.sendMessage("Error downloading media");
                        });

                        client.sendMessage(msg.from, media, {
                            sendMediaAsSticker: true,
                            stickerAuthor: "Author : Mastay",
                            stickerName: "Bocchi Sticker Bot",
                        });
                        msg.react("✅");
                        console.log(`${msg.from} Use command .sticker. Status : Success`);

                    } else if (msg.type === 'video') {
                        const media = await msg.downloadMedia();
                        const filePath = path.join(__dirname, 'result/sticker.mp4');
                    
                        // Simpan media ke file sementara
                        fs.writeFileSync(filePath, media.data, 'base64');

                        // Periksa durasi video menggunakan ffprobe
                        ffmpeg.ffprobe(filePath, (err, metadata) => {
                            if (err) {
                                console.error('Terjadi kesalahan saat mengambil metadata video:', err);
                                return fs.unlinkSync(filePath); // Hapus file sementara jika terjadi kesalahan
                            }

                            const duration = metadata.format.duration;

                            const media = MessageMedia.fromFilePath('result/sticker.mp4')

                            if (duration < 8) {
                                // Kirim file sebagai sticker
                                client.sendMessage(msg.from, media, {
                                    sendMediaAsSticker: true,
                                    stickerAuthor: "Author : Mastay",
                                    stickerName: `Bocchi Sticker Bot`,
                                })
                                .then(() => {
                                    console.log(`${msg.from} Use command .sticker. Status: Success`);
                                    msg.react("✅");
                                    // Hapus file setelah berhasil terkirim
                                    fs.unlinkSync(filePath);
                                })
                                .catch((error) => {
                                    msg.react("❌");
                                    console.error('Terjadi kesalahan saat mengirim sticker:', error);
                                    fs.unlinkSync(filePath); // Hapus file jika terjadi kesalahan saat mengirim
                                });
                            } else {
                                msg.reply(`Durasi maksimal adalah 7 detik.`);
                                msg.react("❌");
                                // Hapus file sementara karena durasi terlalu panjang
                                fs.unlinkSync(filePath);
                            }
                        });
                    } else {
                        console.log(`${msg.from} Use command .sticker. Status : Invalid Format Type`);
                        msg.reply(`Format salah, pastikan kamu mengirim gambar dengan caption .sticker.`)
                        msg.react("❌");
                    }
                } else if(msg.hasQuotedMsg) {
                    const quotedMsg = await msg.getQuotedMessage()

                    if(!quotedMsg.hasMedia) {
                        msg.react("❌")
                        return msg.reply("Pesan yang di reply harus berupa gambar atau video")
                    }

                    msg.react("🔄️");

                    if (quotedMsg.type === 'image') {
                        const media = await quotedMsg.downloadMedia() .catch((err) => {
                            console.error(err);
                            client.sendMessage("Error downloading media");
                        });

                        client.sendMessage(msg.from, media, {
                            sendMediaAsSticker: true,
                            stickerAuthor: "Author : Mastay",
                            stickerName: "Bocchi Sticker Bot",
                        });
                        msg.react("✅");
                        console.log(`${quotedMsg.from} Use command .sticker. Status : Success`);

                    } else if (quotedMsg.type === 'video') {
                        const media = await quotedMsg.downloadMedia();
                        const filePath = path.join(__dirname, 'result/sticker.mp4');
                    
                        // Simpan media ke file sementara
                        fs.writeFileSync(filePath, media.data, 'base64');

                        // Periksa durasi video menggunakan ffprobe
                        ffmpeg.ffprobe(filePath, (err, metadata) => {
                            if (err) {
                                console.error('Terjadi kesalahan saat mengambil metadata video:', err);
                                return fs.unlinkSync(filePath); // Hapus file sementara jika terjadi kesalahan
                            }

                            const duration = metadata.format.duration;

                            const media = MessageMedia.fromFilePath('result/sticker.mp4')

                            if (duration < 8) {
                                // Kirim file sebagai sticker
                                client.sendMessage(msg.from, media, {
                                    sendMediaAsSticker: true,
                                    stickerAuthor: "Author : Mastay",
                                    stickerName: "Bocchi Sticker Bot",
                                })
                                .then(() => {
                                    console.log(`${quotedMsg.from} Use command .sticker. Status: Success`);
                                    msg.react("✅");
                                    // Hapus file setelah berhasil terkirim
                                    fs.unlinkSync(filePath);
                                })
                                .catch((error) => {
                                    msg.react("❌");
                                    console.error('Terjadi kesalahan saat mengirim sticker:', error);
                                    fs.unlinkSync(filePath); // Hapus file jika terjadi kesalahan saat mengirim
                                });
                            } else {
                                msg.reply(`Durasi maksimal adalah 7 detik.`);
                                msg.react("❌");
                                // Hapus file sementara karena durasi terlalu panjang
                                fs.unlinkSync(filePath);
                            }
                        });
                    }
                } else {
                    msg.reply("*PENGGUNAAN* :\n- kirim gambar dengan caption _*.sticker*_ atau _*.s*_\n- Quote gambar yang ingin dijadikan sticker lalu tulis caption _*.sticker*_ atau _*.s*_")
                }
            } else {
                const media = await MessageMedia.fromUrl('https://i.imgur.com/HnzyA9E.png');
                const pushName = (await msg.getContact()).pushname;
                const captionMedia = `${getGreeting()} ${pushName == 'NiceOne' ? 'Owner' : pushName}\n\n*PENGGUNAAN* :\n- kirim gambar dengan caption _*.sticker*_ atau _*.s*_\n- Quote gambar yang ingin dijadikan sticker lalu tulis caption _*.sticker*_ atau _*.s*_`

                client.sendMessage(msg.from, media, {
                    caption: captionMedia
                })
            }
        } catch(err) {
            msg.reply("Ada kesalahan dalam script bot. Silahkan hubungi developer!");
            console.error(err);
        }
    }
})

client.initialize();