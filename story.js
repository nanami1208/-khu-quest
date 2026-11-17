/* =========================================================
   KHU QUEST — 物語データ
   who        : 話している人（'小ライオン' / '先輩ライオン' / 'ナレーション' など）
   text       : セリフ
   choices    : [ [ボタンの文字, true/false/null], ... ]
   afterGood / afterBad / after : 選んだあとのセリフ
   goodNote   : 正しい方を選んだときにもらえるノートID
   quiz       : ミニクイズ（noteは答えたらもらえるノート）
   note       : このシーンが表示されたらもらえるノートID
   type       : 'campus'（キャンパス探索） / 'end'（エンディング）
   pose       : 立ち絵（左下に表示）。assets/ のファイル名（拡張子なし）。例 'lion-sad'
                未指定なら、小ライオン＝baby-lion、先輩ライオン＝guide-lion。
                ナレーション／その他の話者は、立ち絵を出さない。
   poseAfter / poseGood / poseBad : 選んだあとのセリフ用の立ち絵（無ければ pose のまま）
   whoAfter   : 選んだあとのセリフの話者（例 '小ライオン'）。立ち絵と名前がこの話者になる
   ※ pose に横長の画像（16:9に近いもの）を書くと、自動で「一枚絵（背景）」として表示される。
     縦長の画像は、左下の立ち絵になる。
   bg         : 一枚絵（その場面だけ背景になる）。例 'chapter1-discover-university'
                未指定なら、タイトル背景（ぼかし）。
   ========================================================= */

window.KHU_BUILD = window.KHU_BUILD || {}; window.KHU_BUILD.story = '2026-11-17g';   // 版チェック用（消さないこと）
window.KHU_CHAPTERS = ['大学との出会い', '初めての出願', '運命の合格発表', '入金と書類', '入寮と入国', '受講申請', '初授業と学食', '初めての中間試験', '学祭の一日', 'K-PASSとの出会い', 'そして、慶熙で'];
window.KHU_CHAPTER_EN = ['FIRST ENCOUNTER', 'THE APPLICATION', 'THE RESULT', 'THE PAYMENT', 'MOVING IN', 'COURSE REGISTRATION', 'FIRST DAY', 'MIDTERM EXAMS', 'FESTIVAL', 'K-PASS', 'FINALE'];

/* チャプタークリア画面に出す見出しとひとこと */
window.KHU_CHAPTER_CLEAR = [
  { head: '慶熙大学に出会った！',   msg: 'おめでとう！ 大学選びの軸とキャンパスの魅力を手に入れた！' },
  { head: '募集要項を読み解いた！', msg: 'おめでとう！ 出願準備の知識を手に入れた！' },
  { head: '運命の合格発表！',       msg: 'おめでとう！ 合格後にやることリストを手に入れた！' },
  { head: '書類と入金をやり遂げた！', msg: 'おめでとう！ 書類・入金の落とし穴と、逆算のコツを手に入れた！' },
  { head: '入寮と入国日が決まった！', msg: 'おめでとう！ 寮と入国準備のヒントを手に入れた！' },
  { head: '受講申請の作戦を立てた！', msg: 'おめでとう！ 先着順の申請と、開講後の科目変更のコツを手に入れた！' },
  { head: '初授業と学科めぐり！',     msg: 'おめでとう！ 教室移動のコツ、友達づくり、そして3つの学科の魅力を手に入れた！' },
  { head: '中間試験を乗り越えた！',   msg: 'おめでとう！ 友達と一緒に学ぶ、勉強のコツを手に入れた！' },
  { head: '学祭を満喫した！',         msg: 'おめでとう！ 学祭を楽しむコツを手に入れた！' },
  { head: 'K-PASSを知った！',         msg: 'おめでとう！ 奨学金につながる制度と、先輩に聞く大切さを手に入れた！' },
  { head: '慶熙大学への道、完走！',   msg: 'おめでとう！ 留学の鉄則と、慶熙大学の魅力をすべて手に入れた！' },
];

/* ストーリー（大きな区切り）。今遊べるのは STORY 01 だけ。 */
window.KHU_STORIES = [
  { no: '01', title: '入学編', pose: 'lion-celebrating', clearHead: 'おめでとう！ 慶熙大学に無事入学！',
    clearMsg: '子ライオンはたくさんの困難を乗り越え、夢だった慶熙大学への入学を果たしました。' },
  { no: '02', title: 'キャンパス建物探検編', locked: true },
];

window.KHU_STORY = [
  { ch: 0, who: 'ナレーション', text: '高校3年生の6月。日本で育った小ライオンは、韓国の大学を探し始めました。', bg: 'chapter1-discover-university' },
  { ch: 0, who: '小ライオン', text: 'どんなキャンパスで大学生活を送りたいかな？', pose: 'lion-choosing-campus',
    choices: [['自然が多くて、美しいキャンパス！', null], ['都会的でにぎやかなキャンパス！', null]],
    after: 'どちらも素敵！でも私は、緑に囲まれたキャンパスが気になるな。', poseAfter: 'lion-campus-excited' },
  { ch: 0, who: '小ライオン', text: '慶熙大学には外国人留学生向けの奨学金制度もあるんだ！TOPIK5・6級を持っている私も、条件を確認してみよう。', pose: 'lion-guide-book', note: 'scholarship' },
  { ch: 0, who: 'ナレーション', text: '入学奨学金の対象・支給条件は年度や選考区分によって異なります。必ず最新の公式案内を確認しましょう。', bg: 'new-bg-scholarship-info' },
  { ch: 0, who: '小ライオン', text: '自然が多くて落ち着いた場所が好き。実際の雰囲気も知りたいし、旅行がてらキャンパスを見に行こう！', pose: 'lion-talking' },
  { ch: 0, type: 'campus' },
  { ch: 0, who: '小ライオン', text: '日本人の先輩に出会えた！留学生同士のつながりや、在学中の奨学金・行事についても知ることができたよ。', pose: 'lion-welcome' },
  { ch: 0, who: '小ライオン', text: 'よし、私は慶熙大学を目指す！', pose: 'lion-determined', note: 'why-khu' },

  { ch: 1, who: '小ライオン', text: '出願って、何から始めたらいいんだろう？まずは外国人入学の募集要項（모집요강）を読んでみよう。', pose: 'lion-reading' },
  { ch: 1, who: '小ライオン', text: 'あれ……韓国語でわからないところがある。どうしよう？', pose: 'lion-thinking-book',
    choices: [['外国人入学担当部署にメールで質問する', true], ['わからないまま放置する', false]],
    afterGood: 'そうだ！不明点は担当部署に確認しよう。', poseGood: 'lion-phone-happy',
    afterBad: '放置したら締切が近づいてしまった！やっぱり早めに確認しよう。', poseBad: 'lion-phone-worried', goodNote: 'email' },
  { ch: 1, who: 'ナレーション', text: '次は自己紹介書の準備。※必要書類は年度・選考区分で異なるため、実際の募集要項で確認してください。', bg: 'new-bg-personal-statement' },
  { ch: 1, who: '小ライオン', text: '自己紹介書には、どんなことを整理するといいかな？', pose: 'lion-planning',
    quiz: { q: '自己紹介書の準備で大切なのは？',
      a: ['経験や活動、志望理由を具体的に整理する', '好きな食べ物だけを書く', '募集要項を読まずに提出する'], c: 0,
      ex: 'これまでの努力や活動、大学で挑戦したいことを具体的にまとめよう。', note: 'essay' } },
  { ch: 1, who: '小ライオン', text: 'よし、書けた！……と思ったら、提出書類に確認が必要な部分が見つかった！', pose: 'lion-paper-shocked',
    choices: [['諦める', false], ['担当部署にメールで確認する', true]],
    afterGood: '確認して、必要な手続きを進めよう！', poseGood: 'lion-paper-confident',
    afterBad: 'まだ諦めるのは早い！まずは担当部署に確認しよう。', poseBad: 'lion-encouraging', goodNote: 'email' },
  { ch: 1, who: 'ナレーション', text: '時間はかかったけれど、必要な手続きを進めて、無事に出願受付を確認できました。受験番号もゲット！⭐', bg: 'new-bg-application-complete', note: 'apply-flow' },
  { ch: 1, who: 'ナレーション', text: '2027年度の入試からは、面接試験は廃止されました。書類を提出したら、あとは合格発表を待ちます。※選考方法は年度によって変わります。最新の募集要項で確認してください。' },

  { ch: 2, who: 'ナレーション', text: '10月。いよいよ合格発表の日がやってきました。※発表月は物語上の設定です。実際の日程は年度ごとに異なります。', bg: 'new-bg-admission-results' },
  { ch: 2, who: '小ライオン', text: '心臓がドキドキする……。結果を確認しよう！', pose: 'lion-nervous',
    choices: [['合否結果を確認する', true]], afterGood: '画面を開くと……！', poseGood: 'lion-phone-shocked', reveal: true },
  { ch: 2, who: 'ナレーション', text: '합격을 축하합니다! 🌸 慶熙大学、合格おめでとう！', bg: 'new-bg-admission-success', note: 'after-pass', big: true },
  /* ===== CHAPTER 4：入金と書類 ===== */
  { ch: 3, who: 'ナレーション', text: '年が明けた1月初旬。小ライオンのもとに、慶熙大学から突然メールが届きました。📩', bg: 'scene-ch04-01-university-email' },
  { ch: 3, who: '小ライオン', text: 'えっ、いきなり！？……学費と保険料の案内と、英文の残高証明書の提出について？', pose: 'new-lion-documents-shocked' },
  { ch: 3, who: 'ナレーション', text: '※必要な書類・金額・期限は、年度や選考区分によって異なります。必ず自分に届いた案内で確認しましょう。' },
  { ch: 3, who: '小ライオン', text: 'まずは英文の残高証明書から！ 都市銀行で発行してもらおう。', pose: 'new-lion-certificate-confident' },
  { ch: 3, who: 'ナレーション', text: 'ところが窓口で告げられたのは、「発行までおよそ1ヶ月かかります」という言葉でした。', bg: 'scene-ch04-03-bank-counter' },
  { ch: 3, who: '小ライオン', text: '1ヶ月！？ 韓国みたいに、当日には出してもらえないんだ……。', pose: 'new-lion-letter-shocked' },
  { ch: 3, who: 'ナレーション', text: '⚠ 日本では、銀行や支店によって英文の残高証明書の発行に時間がかかることがあります。年末年始をはさむ時期は金融機関が休みになるため、さらに遅れやすくなります。', bg: 'scene-ch04-04-bank-delay', note: 'balance-cert' },
  { ch: 3, who: '小ライオン', text: '次は学費。TOPIK5級の私は、初学期の授業料が半額になるはず。残りの半額を、海外から送金しなきゃ！', pose: 'new-lion-phone-thinking' },
  { ch: 3, who: 'ナレーション', text: '※授業料の減額の対象・割合は、年度や選考区分によって異なります。最新の公式案内で確認してください。', bg: 'scene-ch04-05-tuition-calculation' },
  { ch: 3, who: '小ライオン', text: '手数料が安い方法を探したら……アプリで送金できるサービスを発見！ これにしよう！', pose: 'new-lion-phone-happy' },
  { ch: 3, who: 'ナレーション', text: '⚠ ところが送金ボタンを押すと、エラーの画面が表示されました。', bg: 'scene-ch04-06-transfer-error' },
  { ch: 3, who: '小ライオン', text: '送金できない……！ どうしよう？', pose: 'new-lion-phone-panicked',
    choices: [['大学にメールで送金方法を確認する', true], ['原因がわからないまま、別のアプリで試し続ける', false]],
    afterGood: 'そうだ、不明点は大学の担当部署に確認しよう！', poseGood: 'new-lion-phone-idea',
    afterBad: '時間だけが過ぎていく……。やっぱり大学に確認しよう！', poseBad: 'new-lion-phone-worried', goodNote: 'tuition-pay' },
  { ch: 3, who: 'ナレーション', text: '大学からの返信によると、送金は「大学の銀行口座」または「海外送金を取り扱っている支店」から行う必要があるとのことでした。', bg: 'scene-ch04-07-transfer-instructions' },
  { ch: 3, who: 'ナレーション', text: '⚠ ただし日本では、予約が必須の支店や、海外送金を取り扱っていない支店もあります。着金まで1週間ほどかかることも。', bg: 'scene-ch04-08-transfer-deadline' },
  { ch: 3, who: '小ライオン', text: '念入りに確認したつもりだったのに……。手続きに手間取っているうちに、入金の期限が……！', pose: 'new-lion-documents-confused' },
  { ch: 3, who: 'ナレーション', text: '小ライオンは、入金に間に合いませんでした。入金が確認できないと、入学許可書が発行されない大学もあります。', bg: 'scene-ch04-09-payment-failure' },
  { ch: 3, who: 'ナレーション', text: '……はっ！ 目が覚めると、今までのことはすべて夢でした。😳', bg: 'scene-ch04-10-waking-from-dream', dream: true },
  { ch: 3, who: '小ライオン', text: '夢でよかった……。でも、これが現実にならないように、今のうちに動こう。何から始めるのが正解なんだろう？', pose: 'new-lion-notes-nervous',
    quiz: { q: '夢の失敗を防ぐために、最初にやるべきことは？',
      a: ['期限の直前にまとめて手続きする', '期限から逆算して、時間のかかるものから動く', '書類がそろってから送金方法を調べ始める'], c: 1,
      ex: '残高証明書の発行や海外送金は日数がかかる。期限から逆算して、時間のかかるものから先に動こう。', note: 'backward-plan' } },
  { ch: 3, who: 'ナレーション', text: '期限から逆算して動いた小ライオンは、書類も入金も無事に完了。入学許可書をメールで受け取りました。⭐', bg: 'scene-ch04-11-admission-letter', note: 'admission-letter' },
  { ch: 3, who: '小ライオン', text: 'やった……！ これで、韓国へ行く準備が一歩進んだ！', pose: 'new-lion-passport-cheering' },

  /* ===== CHAPTER 5：入寮と入国 ===== */
  { ch: 4, who: '小ライオン', text: '最初の学期は、友達をつくるために寮に入ろう！ 先輩ライオンにも聞いてみよう。', pose: 'new-lion-notebook-cheering' },
  { ch: 4, who: '先輩ライオン', text: '寮のことなら任せて！ 僕が入った寮は2人部屋だったよ。ルームメイトがいると、友達もできやすいんだ。', pose: 'senior-dorm-room', note: 'dorm' },
  { ch: 4, who: '先輩ライオン', text: '僕の時は、入寮できるのは基本的に最初の学期だけだったよ。その後は自分で住まいを探すことになるんだ。', pose: 'senior-dorm-period' },
  { ch: 4, who: 'ナレーション', text: '※部屋のタイプや入寮できる期間は、年度や寮によって異なる場合があります。最新の公式案内で確認してください。', bg: 'scene-ch05-01-dormitory-research' },
  { ch: 4, who: '先輩ライオン', text: 'それと、入寮日は開講の直前なんだ。僕は学科のオリエンテーションに合わせて、韓国に入国したよ。', pose: 'senior-dorm-arrival' },
  { ch: 4, who: 'ナレーション', text: '先輩ライオンが、電話で小ライオンと同じ学科の先輩にも連絡を取ってくれました。', bg: 'scene-ch05-02-senior-phone-call' },
  { ch: 4, who: '先輩ライオン', text: '聞いてみたら……なんと、君の学科のOTはオンライン開催なんだって！', pose: 'senior-online-ot' },
  { ch: 4, who: '小ライオン', text: 'オンラインなら、日本から参加できる！ それなら入寮を選んで、開講の直前に入国しよう！', pose: 'new-lion-tablet-cheering' },
  { ch: 4, who: 'ナレーション', text: '⚠ 学科のOTや새터（新入生向けの合宿型オリエンテーション）は、時期も形式も学科によって大きく異なります。必ず自分の学科の案内で確認しましょう。', bg: 'scene-ch05-03-orientation-schedule' },
  { ch: 4, who: '小ライオン', text: '先輩の学科と私の学科が同じとは限らないよね。入国日を決める前に、何をすればいいかな？', pose: 'new-lion-uniform-thinking',
    quiz: { q: '入国日を決める前に、まずやるべきことは？',
      a: ['先輩の入国日に合わせて、同じ日に入国する', '自分の学科からの案内で、OTの日程と形式を確認する', '寮の入寮日だけを見て、入国日を決める'], c: 1,
      ex: 'OTや새터の時期・形式は学科ごとに違う。先輩の話は参考にしつつ、自分の学科の公式な案内で確認しよう。', note: 'orientation' } },
  { ch: 4, who: 'ナレーション', text: 'するとそこへ、メールが届きました。入寮の申請案内です！📩', bg: 'scene-ch05-04-dormitory-email' },
  { ch: 4, who: '小ライオン', text: '来た！ すぐに申請しよう！', pose: 'new-lion-phone-excited' },
  { ch: 4, who: 'ナレーション', text: '申請から数日後——。寮の当選メールが届きました！🎉 ここで入寮日、つまり入国日が決まります。', bg: 'scene-ch05-05-dormitory-accepted' },
  { ch: 4, who: '小ライオン', text: 'いよいよだ……！ 韓国へ出発する日が決まった！', pose: 'new-lion-passport-determined' },
  /* ===== CHAPTER 7：受講申請 ===== */
  { ch: 5, who: 'ナレーション', text: '入国日が決まった小ライオン。次の関門は、授業を決める「受講申請」です。', bg: 'scene-ch05-05-dormitory-accepted' },
  { ch: 5, who: '小ライオン', bg: 'scene-ch05-02-senior-phone-call', text: '受講申請って、何から始めたらいいんだろう……？ 全然わからない！ 先輩に連絡してみよう！📱', pose: 'new-lion-notes-nervous' },
  { ch: 5, who: '小ライオン', text: '先輩、受講申請ってどうしたらいいんですか？', pose: 'new-lion-phone-thinking' },
  { ch: 5, who: '先輩ライオン', text: '新入生の場合、申請期間が4年生、3年生、2年生、1年生の順に行われるんだ。だから基本的には、開講の直前に、先着順で申請していくよ。', pose: 'senior-encouragement', note: 'course-registration' },
  { ch: 5, who: '小ライオン', text: 'えっ、ってことは……残った中から、早い者勝ちですか？', pose: 'new-lion-surprised-thinking' },
  { ch: 5, who: '先輩ライオン', text: 'そうだよ！ 各学年で取れる人数が割り当てられていて、その中から先着順なんだ。', pose: 'senior-encouragement' },
  { ch: 5, who: '先輩ライオン', text: '講義計画書を見ながら計画は立てたんだけど、一年生の頃は、その通りにはいかなかったな……。', pose: 'senior-encouragement' },
  { ch: 5, who: '小ライオン', text: 'えええぇ……。', pose: 'new-lion-phone-panicked' },
  { ch: 5, who: '先輩ライオン', text: 'でも、開講から一週間は科目変更ができるんだ。受講申請のときに逃した科目も、増員やキャンセル待ちで申請できることがあるよ！', pose: 'senior-encouragement' },
  { ch: 5, who: '小ライオン', text: '本当ですか！ アドバイスありがとうございます！', pose: 'new-lion-phone-happy' },
  { ch: 5, who: '小ライオン', text: 'ちなみに、受講申請はいつもどこでしているんですか？', pose: 'new-lion-phone-excited' },
  { ch: 5, who: '先輩ライオン', text: '僕は開講ギリギリまで日本にいるから、自分のパソコンで行っているよ！', bg: 'scene-ch05-01-winter-laptop', pose: 'senior-online-ot' },
  { ch: 5, who: 'ナレーション', text: '※申請の期間・順番・人数の割り当てや、科目変更の期間・方法は、年度・学年・学科によって異なります。必ず自分の学科・大学の最新の案内で確認してください。' },
  { ch: 5, who: '小ライオン', text: '希望の科目が取れなかったとき、私ならどうしたらいいかな？', pose: 'new-lion-documents-confused',
    quiz: { q: '希望の科目を申請で逃してしまったとき、できることは？',
      a: ['あきらめて、別の科目で学期を過ごす', '開講後の科目変更の期間に、増員やキャンセル待ちで申請できないか確認する', '申請期間が終わったら、何をしても無駄だと考える'], c: 1,
      ex: '開講から一週間は科目変更ができる。申請のときに逃した科目も、増員やキャンセル待ちで申請できることがある。', note: 'course-change' } },
  { ch: 5, who: 'ナレーション', text: 'これで小ライオンも、受講申請の対策はバッチリ！ 開講の直前に、自分のパソコンで申請します。💻✨' },
  { ch: 5, who: '小ライオン', text: '講義計画書を見ながら、第一希望も、第二希望も、しっかり準備しておこう！', pose: 'new-lion-tablet-cheering' },
  /* ===== 初授業と学食 =====
     ※ゲーム内の章番号は連番です（仕様上、台本の章番号とずれることがあります）。
       追加するときは、この章の直前（ch: 4 の最後のシーンの後ろ）に差し込めば、番号は自動で付き直ります。 */
  { ch: 6, who: 'ナレーション', text: '入学後、初めての授業の日。緊張で目が覚めてしまった小ライオンは、早めに学校の正門に到着しました。', bg: 'scene-ch06-01-campus-entrance' },
  { ch: 6, who: '小ライオン', text: '早く着いたぞ！ 1限の教室は青雲館だ。これなら余裕だね！', pose: 'new-lion-backpack-smile' },
  { ch: 6, who: 'ナレーション', text: 'ところが青雲館の前には、エレベーターを待つ長い列が、外まで続いていました。😱', bg: 'scene-ch06-02-elevator-queue' },
  { ch: 6, who: '小ライオン', text: 'えっ、こんなに！？ ……でも、私の教室は7階。乗るしかない……。並んで待とう。', pose: 'new-lion-surprised-thinking' },
  { ch: 6, who: 'ナレーション', text: '⚠ 授業が始まる前の時間帯は、エレベーターが混み合うことがあります。高い階に教室がある場合は、建物に着いてからの移動時間も多めに見ておきましょう。', bg: 'scene-ch06-03-elevator-warning', note: 'first-class' },
  { ch: 6, who: 'ナレーション', text: 'ようやく教室に着いたのは、授業開始2分前の8時58分。初日から、ギリギリでした。⏰', bg: 'scene-ch06-04-first-class' },
  { ch: 6, who: '小ライオン', text: 'はぁ、はぁ……セーフ！ 早く来たのに、初日から焦っちゃった……。', pose: 'new-lion-awkward-smile' },
  { ch: 6, who: 'ナレーション', text: '席に着いて息を整えていると、斜め後ろの席の学生が声をかけてくれました。日本人の留学生です！', bg: 'scene-ch07-08-classroom-greeting' },
  { ch: 6, who: '日本人の留学生', text: 'ねえ、日本人だよね？ 同じ日本人の留学生なんだ。授業が終わったら、一緒に学食に行かない？', pose: 'friend-japanese-student',
    choices: [['「ぜひ！ 行きたいです！」と笑顔で答える', true], ['緊張して、うつむいてしまう', false]],
    afterGood: '勇気を出して返事をしたら、ぐっと距離が縮まった！', poseGood: 'new-lion-shy-wave',
    afterBad: 'つい固まってしまった……。でも、もう一度勇気を出して「行きたいです」と伝えよう！', poseBad: 'new-lion-nervous', whoAfter: '小ライオン', goodNote: 'make-friends' },
  { ch: 6, who: 'ナレーション', text: '授業が終わると、二人は一緒に学食へ向かいました。🍚', bg: 'scene-ch07-07-cafeteria-lunch' },
  { ch: 6, who: '小ライオン', text: '声をかけてもらえて、本当によかった……！ 学食、楽しみだな！', pose: 'new-lion-excited' },
  { ch: 6, who: 'ナレーション', text: '学食を食べたあと。小ライオンは、消化がてら、坂の上まで登ってみることにしました。どんな建物や学科があるのか、ずっと気になっていたのです。⛰', bg: 'scene-ch07-06-uphill-walk' },
  { ch: 6, who: '小ライオン', text: 'よし、腹ごなしに、坂を登ってみよう！ 上には、何があるのかな？', pose: 'lion-girl-ch07-07-climbing-hill' },
  { ch: 6, type: 'campus', map: 'hill' },
  { ch: 6, who: '小ライオン', text: 'いろんな学科があるんだ……！ 坂を登って、本当によかった！', pose: 'lion-girl-ch07-06-campus-discovery', bg: 'scene-ch07-08-department-tour' },

  /* ===== CHAPTER 7：初めての中間試験 ===== */
  { ch: 7, who: 'ナレーション', text: '5月、学期の半ば。初めて韓国語で受ける中間試験が、1週間後に迫っていました。', bg: 'scene-ch07-06-study-stress' },
  { ch: 7, who: '小ライオン', text: '日本語でも大変なのに、韓国語で記述問題……！ 一人じゃ不安だから、友達と一緒に勉強しよう！', pose: 'lion-girl-ch07-01-study-together' },
  { ch: 7, who: 'ナレーション', text: 'それから毎日、二人は図書館、空き教室、カフェを行き来して、勉強に籠りました。', bg: 'scene-ch07-05-library-study' },
  { ch: 7, who: '小ライオン', text: 'あれ？ 課題の問題を解いていたら、私がつまずいたところと、友達がつまずいたところが、全然違う……！', pose: 'lion-girl-ch07-02-confused-about-answers',
    choices: [['わからないところを教え合い、自分の言葉で説明し合う', true], ['それぞれ黙々と、一人で丸暗記する', false]],
    afterGood: '説明してみると、自分のあやふやなところが、はっきりわかる！', poseGood: 'lion-girl-ch07-03-explaining',
    afterBad: '一人だと、つまずきに気づけないままかも……。やっぱり、説明し合ってみよう！', poseBad: 'lion-girl-ch07-04-discuss-together', goodNote: 'study-together' },
  { ch: 7, who: 'ナレーション', text: '試験の前夜。二人は、お互いに例を出しながら、最後の説明し合いをしました。', bg: 'scene-ch07-04-study-together' },
  { ch: 7, who: 'ナレーション', text: '迎えた試験当日。記述問題を見て、小ライオンは思わず息をのみました。前夜に二人で説明し合った例が、そのまま出題されていたのです！✨', bg: 'scene-ch07-03-exam-writing' },
  { ch: 7, who: 'ナレーション', text: '6科目すべての試験が終わった日。二人は顔を見合わせて、にまりと笑いました。', bg: 'scene-ch07-02-campus-friends' },
  { ch: 7, who: '小ライオン', text: '終わったー！ お疲れ様！ 今日は、お疲れ様会をしよう！', pose: 'lion-girl-ch07-05-celebration' },

  /* ===== CHAPTER 8：学祭の一日 ===== */
  { ch: 8, who: 'ナレーション', text: '5月。テストが終わったら、待ちに待った学祭！慶熙大学の学祭には、有名なアーティストが来るという噂がありました。', bg: 'scene-ch08-03-festival-venue' },
  { ch: 8, who: '小ライオン', text: 'しかも今年は、私の大好きなアーティストが来るんだって！！ 絶対に見たい！', pose: 'lion-girl-ch08-01-excited-artist' },
  { ch: 8, who: 'ナレーション', text: 'ところが、その日の授業は13時15分まで。小ライオンは、授業が終わると同時に、リストバンドの引き換え場所へダッシュしました。🏃', bg: 'scene-ch07-01-cheongun-running' },
  { ch: 8, who: '小ライオン', text: 'ステージ横の席は確保できた！ ここから、ずっと待つよ！ ごはんの準備はどうしよう？', pose: 'lion-girl-ch08-02-waiting-for-concert',
    choices: [['友達と交代で席を守りながら、ごはんを準備する', true], ['全員で席を空けて、ごはんを買いに行く', false]],
    afterGood: '交互に抜ければ、席もごはんも両方確保できる！', poseGood: 'lion-girl-ch08-03-taking-turns',
    afterBad: '全員で離れたら、席がなくなってしまうかも！ 交代で動こう！', poseBad: 'lion-girl-ch08-04-protecting-seats', goodNote: 'festival' },
  { ch: 8, who: 'ナレーション', text: '友達と交互に席を抜けて、おいしいごはんを準備しながら、ひたすら待つこと、なんと7時間……。⏳', bg: 'scene-ch08-02-festival-waiting' },
  { ch: 8, who: 'ナレーション', text: 'そしてついに、ステージに大好きなアーティストが登場しました！ 歓声に包まれて、小ライオンは思わず涙ぐみました。🎤✨', bg: 'scene-ch08-01-festival-concert', big: true },
  { ch: 8, who: '小ライオン', text: '7時間待って、本当によかった……！ 最高の思い出になったよ！', pose: 'lion-girl-ch08-05-happy-memories' },

  /* ===== CHAPTER 9：K-PASSとの出会い ===== */
  { ch: 9, who: 'ナレーション', text: 'ある日のカフェ。小ライオンは、偶然、先輩ライオンと出会いました。☕', bg: 'scene-ch09-03-senior-support' },
  { ch: 9, who: '小ライオン', text: 'あっ、先輩！ ちょうどよかった。この間インスタで見かけた「K-PASS」のことで、聞きたいことがあったんです……！ 思い切って話しかけてみよう。', pose: 'lion-girl-ch09-01-approaching-senior' },
  { ch: 9, who: '小ライオン', text: '先輩、今お時間ありますか？', pose: 'lion-girl-ch09-02-greeting-senior' },
  { ch: 9, who: '先輩ライオン', text: 'いいよ、どうしたの？', pose: 'lion-boy-ch10-01' },
  { ch: 9, who: '小ライオン', text: 'K-PASSについて、よくわからなくて……。', pose: 'lion-girl-ch09-03-asking-about-kpass' },
  { ch: 9, who: '先輩ライオン', text: 'K-PASSは、行事や説明会、特別講義（특강）など、いろんな企画に参加するたびにポイントがもらえる制度だよ。そのポイントを貯めると、奨学金がもらえるんだ。', pose: 'lion-boy-ch10-02', note: 'k-pass' },
  { ch: 9, who: 'ナレーション', text: '※K-PASSの内容・ポイント・奨学金の条件は、年度や学期によって変わる場合があります。最新の公式案内で確認してください。', bg: 'scene-ch09-02-kpass-discussion' },
  { ch: 9, who: '小ライオン', text: 'こんな制度があるんですね、知らなかったです……！', pose: 'lion-girl-ch09-04-surprised-by-kpass' },
  { ch: 9, who: '先輩ライオン', text: '僕の先輩の代には、なかったんだって。こういうのは、積極的に参加してみてね！', pose: 'lion-boy-ch10-03' },
  { ch: 9, who: '小ライオン', text: 'K-PASSって、どんな制度だったかな？ 整理しておこう！', pose: 'lion-girl-ch09-05-kpass-notes',
    quiz: { q: 'K-PASSについて、正しいのは？',
      a: ['行事や説明会などに参加してポイントを貯め、奨学金につなげる制度', '何もしなくても、自動的に奨学金がもらえる制度', '先輩の代から、ずっと同じ内容で続いている制度'], c: 0,
      ex: '企画に参加するごとにポイントがたまり、貯めると奨学金につながる。こうした制度は年度で変わるので、自分から情報を集めて、積極的に参加しよう。', note: 'k-pass-tips' } },
  { ch: 9, who: 'ナレーション', text: '直近で、リンゴ収穫のイベントがありました。小ライオンは、迷わず応募しました！🍎', bg: 'scene-ch09-01-kpass-phone' },
  { ch: 9, who: '小ライオン', text: '新しいことに、どんどん挑戦してみよう！', pose: 'lion-girl-ch09-06-new-challenges' },

  /* ===== 最終章：そして、慶熙で ===== */
  { ch: 10, who: 'ナレーション', text: 'ふりかえると、高校3年生の6月。韓国の大学を探しはじめた小さな一歩から、すべてが始まりました。', bg: 'scene-ch01-03-campus-research' },
  { ch: 10, who: 'ナレーション', text: '募集要項を読み、わからないところは大学に質問して、無事に出願。ドキドキの合格発表。', bg: 'scene-ch05-02-application-guide' },
  { ch: 10, who: 'ナレーション', text: '書類や入金に手間取りながらも、期限から逆算して準備して、寮と入国日を決めました。', bg: 'scene-ch05-01-winter-laptop' },
  { ch: 10, who: 'ナレーション', text: '入学したら、初授業の大あわて。友達と励まし合って乗り越えた中間試験。7時間待った学祭。先輩に教わったK-PASS。', bg: 'scene-ch01-02-campus-album' },
  { ch: 10, who: '小ライオン', text: '大変なこともたくさんあったけど、ひとつひとつ、乗り越えてきたんだ……！', pose: 'lion-girl-ch10-01-overcoming-challenges' },
  { ch: 10, who: '先輩ライオン', text: 'ここまで来たね！ 慶熙大学の魅力って、なんだと思う？ 一緒に考えてみよう。', pose: 'lion-boy-ch11-04' },
  { ch: 10, who: '先輩ライオン', text: '緑に囲まれたキャンパスに、歴史ある本館や平和の殿堂。ほっと落ち着ける場所が、学びの毎日を支えてくれるんだ。', pose: 'lion-boy-ch11-05' },
  { ch: 10, who: '先輩ライオン', text: '日本人の留学生同士で助け合えるし、先輩や友達に相談もできる。一人じゃないって思えるのが、いちばん心強いところだよ。', pose: 'lion-boy-ch11-06' },
  { ch: 10, who: '先輩ライオン', text: 'それに、学祭の一日や、K-PASSみたいな奨学金につながる制度まで。学ぶだけじゃなく、思い出も、チャンスも、自分でつかみにいけるんだ！', pose: 'lion-boy-ch11-07', note: 'khu-charm' },
  { ch: 10, who: '小ライオン', text: 'この冒険で、いちばん大切だったことって、なんだろう？', pose: 'lion-girl-ch10-02-reflecting',
    quiz: { q: '小ライオンの冒険から学べる、いちばん大切なことは？',
      a: ['公式情報を確認し、わからないことは聞いて、期限から逆算して動く', '先輩の話だけを信じて、自分では確認しない', 'なんとかなると考えて、直前に動く'], c: 0,
      ex: '制度や日程は年度で変わる。公式案内で確認し、わからないことは質問して、時間のかかるものから逆算して動くことが、いちばんの近道になる。', note: 'summary-rules' } },
  { ch: 10, who: 'ナレーション', text: '一歩ずつ、準備を重ねた小ライオン。慶熙大学での日々は、まだ始まったばかりです。🌸', bg: 'scene-ch01-01-campus-arrival' },
  { ch: 10, who: '小ライオン', text: 'あなたも、慶熙大学で、素敵な毎日をはじめよう！', pose: 'lion-girl-ch10-03-welcome-to-khu', big: true },
  { ch: 10, type: 'end' },
];

/* ---------- キャンパス探索 ----------
   x / y は背景画像に対する % 位置。背景に合わせて数字を調整してください。 */
window.KHU_CAMPUS = {
  start: { x: 34, y: 89 },
  guide: { x: 45, y: 60,
    poses: ['campus-welcome', 'campus-introduction', 'campus-senior-experience', 'campus-student-support', 'campus-exploration-guide'],
    donePose: 'campus-next-chapter',   // 調べ終わったあとに話しかけたときの画像
    lines: [
      '慶熙大学へようこそ！ 僕がキャンパスを案内するよ！',
      'ここはソウルキャンパス。緑に囲まれた建物がたくさんあるんだ。',
      '僕も日本から来たんだ。日本人留学生同士で情報交換したり、先輩に相談したりできるよ。',
      '留学生向けの行事や奨学金制度もあるから、最新の案内を確認してみてね！',
      '時間があれば、光っている場所も調べてみて。攻略ノートが手に入るよ！',
    ], note: 'campus-guide' },
  spots: [
    { id: 'main',    name: '本館',       x: 45, y: 29, note: 'spot-main', art: 'bg-main-building', poses: ['lion-amazed', 'lion-pointing'],
      lines: ['石造りの大きな建物……！', 'これが慶熙大学の本館。パンフレットで見たのと同じだ！'] },
    { id: 'peace',   name: '平和の殿堂', x: 60, y: 22, note: 'spot-peace', art: 'bg-peace-hall', poses: ['lion-impressed', 'lion-explaining'],
      lines: ['まるでヨーロッパのお城みたい！', '入学式や卒業式、コンサートにも使われるホールなんだって。'] },
    { id: 'gate',    name: '正門',       x: 33, y: 81, note: 'spot-station', art: 'bg-main-gate', poses: ['lion-looking-around', 'lion-happy'],
      lines: ['正門の外は回基駅へ続く学生街。', 'パジョン屋さんのいい匂いがする……授業のあとに来てみたいな。'] },
  ],
};

/* ---------- キャンパス探索（2回目）：学食のあと、坂の上の学科めぐり ----------
   x / y は背景画像に対する % 位置。URLの末尾に ?pick を付けて開くと、地図をクリックした場所の x / y が表示される。
   req    : （使いたいときだけ）そのスポットを先に調べるまで、光らない。今は使っていない＝全部が最初から光る
   caption: 画像の上に大きく出す文字
   popup  : true にすると、セリフ送りではなく「学科紹介のポップアップ」で全部を一気に表示する（avatar = そのときずっと出ているアバター画像名／avatarName・avatarNote = アバターの頭上に出す名前と入学区分）
   art    : 一枚絵（背景）　poses : セリフごとの立ち絵
   ※アバター画像が無いうちは、小ライオンの立ち絵が代わりに出る */
window.KHU_CAMPUSES = {
  hill: {
    title: '🏫 慶熙大学 坂の上エリア',
    mission: { start: '', going: '光っている場所（✦）を調べよう', done: '全部調べた！ PERFECT 🎉 「次へ進む」を押そう' },
    start: { x: 44, y: 86 },
    guide: null,
    popupBg: 'scene-ch07-08-department-tour',   // 学科紹介のポップアップの後ろに敷く一枚絵
    spots: [
      { id: 'slope', name: '坂道', x: 53, y: 50, note: 'campus-slope', who: '🔍 坂道',
        art: ['scene-ch07-07-uphill-break', 'scene-ch07-06-uphill-walk', 'scene-ch07-08-department-tour'], captions: ['', '', '大変…'], poses: ['lion-girl-ch07-08-steep-hill', 'lion-girl-ch07-09-exhausted', 'lion-girl-ch07-10-keep-climbing'],
        lines: ['はぁ、はぁ……！ 思っていたより、ずっと急な坂……！', 'ゼーハー……これを毎日登る人もいるんだ……。', '大変……。でも、この先に何があるのか気になる！ 少し休んだら、登りきろう！'] },
      { id: 'ho', name: '文化エンターテインメント学科', popup: true, avatar: 'dept-culture-ent', avatarName: 'まい', avatarNote: '2024年度新入学', x: 27, y: 43, note: 'dept-culture-ent', who: '🎓 文化エンターテインメント学科',
        lines: [
          '【どんな学科？】文化コンテンツの企画、エンタメ産業、マーケティング、観光、イベント、映像、ゲーム、音楽、韓流など、文化やエンターテインメントを幅広く学べる学科だよ！',
          '【何を勉強するの？】K-POP、ドラマ、映画、アニメ、ゲームなどの事例を通して、コンテンツが社会や経済に与える影響を考えるよ。マーケティングや経営戦略、消費者の行動、エンタメの法律まで学べるんだ。',
          '【授業の雰囲気】グループワーク（팀플）、プレゼン、ディスカッションが多め。自分たちでアイデアを考えて、企画として形にする機会があるよ。',
          '【実践的な学び】企画書づくり、マーケティング戦略、事例分析、PPT発表など。キャップストーンデザイン（캡스톤디자인）では、地域や企業の課題を調べて、解決につながる企画を考えるよ。',
          '【日本人留学生にとっての魅力】K-POPや韓国ドラマ、キャラクター文化、観光コンテンツを、現地の視点で学べる！ 日本と韓国のコンテンツを比べる機会もあるよ。',
          '【こんな人におすすめ】エンタメ、コンテンツ制作、広告、イベント、観光に興味がある人。「見る・楽しむ」から「企画する・生み出す・広める」へ！',
        ] },
      { id: 'kor', name: '国語国文学科', popup: true, avatar: 'dept-korean-lit', avatarName: 'みく', avatarNote: '2024年度編入', x: 60, y: 30, note: 'dept-korean-lit', who: '🎓 国語国文学科',
        lines: [
          '【どんな学科？】所属はソウルキャンパス・文科大学。設立は1955年2月で、慶熙大学が総合大学として認可されたとき、最初に設置された学科なんだ。',
          '【特徴】歴史ある伝統的な人文学科だけど、最近はデジタル人文学や文化コンテンツなど、現代社会に合わせた分野にも力を入れているよ。主な研究分野は、国語学、古典文学、現代文学、韓国語学、文化コンテンツ。',
          '【何を勉強するの？① 国語学（국어학）】韓国語の文法・音韻・語彙・意味・歴史を分析する分野。形態論、音韻論、国語史、統語論など、韓国語がどんな仕組みで成り立っているのかを研究するよ。',
          '【② 古典文学（고전문학）】昔の韓国の小説、詩歌、漢文学、神話、口承文学などを学ぶよ。『春香伝』『洪吉童伝』のような作品や、漢文で記された文学も対象なんだ。',
          '【③ 現代文学（현대문학）】韓国の近現代の小説、詩、演劇、文学批評など。作品を読むだけでなく、その時代の社会や人間の心理、作者の表現方法まで分析するよ。',
          '【④ 韓国語学・韓国語教育（한국어학）】外国人への韓国語教育、比較言語学、韓国語と文化の関係など。日本語と韓国語の共通点や違いを研究したい人にも向いているよ。',
          '【⑤ 文化コンテンツ（문화콘텐츠）】文学や文化を、映画・ゲーム・観光・デジタルメディアなどに応用する分野。物語の構造や文化の価値を分析して、新しいコンテンツを企画することもできるよ。',
        ] },
      { id: 'media', name: 'メディア学科', popup: true, avatar: 'dept-media', avatarName: 'ななみ', avatarNote: '2025年度新入学', x: 75, y: 37, note: 'dept-media', who: '🎓 メディア学科',
        lines: [
          '【どんな学科？】広告、映像、ジャーナリズム、コミュニケーション、メディアビジネス、デジタル技術など、私たちの生活に身近な「メディア」を、幅広い視点から学べる学科だよ！',
          '【何を勉強するの？】実際の企業や広告、SNS、ニュースを題材に、普段何気なく見ているコンテンツを、専門的な視点で分析するよ。',
          '【授業の雰囲気】グループワーク（팀플）、プレゼン、ディベートなど、自分たちで考えて発信する機会が多いよ。放送局の見学も、抽選で行けちゃうんだ！',
          '【実践的な学び】企画書の作成、PPTでの発表、データ分析、映像制作など。課題は大変なこともあるけれど、そのぶん達成感も大きいよ！',
          '【日本人留学生にとっての魅力】SNSやデジタルコンテンツ、エンタメ、広告で注目されている韓国で、現地の学生と一緒にメディアを学べるよ。韓国語での発表やチーム活動で、語学力やコミュニケーション力も磨けるんだ。',
          '【こんな人におすすめ】SNSや広告、映像、韓国のエンタメ業界に興味がある人。メディアを「見る側」から「考え、発信する側」へ！',
        ] },
    ],
  },
};
