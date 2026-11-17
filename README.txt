KHU QUEST v2 — 攻略ノート＆演出強化版

■ 使い方
1. assets フォルダに既存の画像4枚を入れる：
   baby-lion.png / guide-lion.png / campus-background.jpg / title-background.jpg
2. index.html を VS Code の Live Server で開く。
3. フォルダごと Netlify にアップロードすれば公開できる。

■ ファイル
index.html     ゲーム画面
style.css      ゲームのデザイン
game.js        ゲームの処理（ふつうは触らなくてOK）
story.js       ★物語・クイズ・キャンパスの調査スポット（文章を直すのはここ）
notes.js       ★攻略ノートの中身（ノートを足す・直すのはここ）
notebook.html / notebook.css   攻略ノートのダッシュボード（別ページ）
backup-chapter1-4/             前のバージョンのバックアップ

■ まず必ず調整すること
story.js の一番下の KHU_CAMPUS にある x / y は、仮の背景画像に合わせた仮の位置。
本物の背景で「本館」「平和の殿堂」「正門」が実際に描かれている場所に合わせて、数字（%）を直すこと。
スマホでは左下に十字ボタンが出るので、左下すぎる位置（x<20 かつ y>75）は避ける。

■ チャプタークリア画面
章が終わるたびに「CHAPTER 0X CLEAR!」画面が出て、その章で手に入れたノートの要点が並ぶ。
・見出しとひとこと → story.js の KHU_CHAPTER_CLEAR
・要点（3〜5個）→ notes.js の各ノートの points
・公式リンク → notes.js の link（今は https://iadmission.khu.ac.kr/ ）
最後は「STORY 01 CLEAR!」画面。STORY 02 は story.js の KHU_STORIES で locked: true（COMING SOON 表示）。

■ ノートを増やすとき
1. notes.js の KHU_NOTES に1件追加（id は英数字で、ほかと重ならないように）
2. story.js の該当シーンに note: 'そのid' を付ける
   （選択肢で正しい方を選んだときは goodNote、クイズは quiz の中に note）

■ 動作確認用
ブラウザのコンソールで KHUDebug.jump(5) と入力すると、5番目のシーン（キャンパス）に飛べる。
記録を消したいときは、ダッシュボード下の「記録をリセット」を2回押す。

※入学・奨学金・ビザなどの内容は、提出前に最新の公式募集要項と照らし合わせて確認すること。

■ 画像の指定のしかた（v3）
・assets/ に画像を入れて、story.js ではファイル名（拡張子なし）だけを書く。
    pose: 'lion-sad'                … 立ち絵（画面の左下）。セリフ1行ごとに指定できる
    poseGood / poseBad / poseAfter … 選択肢を選んだあとのセリフの立ち絵
    bg: 'chapter1-discover-university' … 一枚絵（その場面だけ背景いっぱいに表示）
・指定しなかったとき：小ライオン＝baby-lion、先輩ライオン＝guide-lion、背景＝タイトル画像（ぼかし）。
・ナレーションのときは、立ち絵も名前も出さない。
・キャンパスの調査は KHU_CAMPUS の art（一枚絵）と poses（セリフごとの立ち絵）。
・拡張子は .png / .jpg / .webp のどれでもOK（自動で探す）。
・Windows のエクスプローラーは拡張子を隠すので、「lion-talking.png」と見えるファイルは
  実際は lion-talking.png.png のことがある。見つかるようにしてあるが、名前を直すのがおすすめ。
・横長の画像（16:9に近い）を pose に書くと、自動で「一枚絵（背景）」として表示される。縦長なら左下の立ち絵。
・whoAfter: '小ライオン' … 選択肢を選んだあとのセリフの話者を変える（名前と立ち絵がその話者になる）。

■ 画像を軽くする（公開前におすすめ）
・compress-assets.html を開き、assets フォルダを選ぶと、各画像の .webp 版（約1/10の大きさ）を作れる。
・ゲームは .webp があれば、そちらを先に読み込む（無ければ png / jpg を読む）。
・画像を描き直して png を差し替えたときは、.webp も作り直すこと（古い webp が使われ続けるため）。
・動作を確認できたら、元の png / jpg は assets の外に移しておく。公開するときも軽くなる。
・check-assets.html は、画像が story.js どおりに見つかるかの確認ページ。どちらのツールも、提出するフォルダには入れなくてよい。

■ 古いファイルが混ざったときの警告（build 2026-11-10c）
・画面の一番上に赤い帯が出たら、書かれているファイルが古い。最新版に入れ替えて Ctrl + Shift + R。
・ページの一番下の「build 2026-11-10c」は、いま動いている版の目印。
・版を上げるときは、game.js / story.js / notes.js / index.html / style.css の 2026-11-10c をそろえて変える。

■ タイトル画像と攻略ノートのアイコン（build 2026-11-10c）
・タイトル画面と、物語の通常の背景（ぼかし）は assets/new-senior-campus-scene を使う。
  変えたいときは game.js の IMG.title の名前を書き換える（無いときは title-background を使う）。
・攻略ノートの 📘 は、assets/new-university-notebook の本のイラストに置き換わる（無ければ 📘 のまま）。
  タブのアイコンにも使う。
