import type { Product } from "../entity/Product.js";

const PRODUCTS: Product[] = [
  { id: 1, name: "明日葉", aliases: ["あしたば", "アシタバ"], imagePath: "/static/ashitaba.png" },
  { id: 2, name: "アスパラガス", aliases: ["アスパラ", "あすぱら", "あすぱらがす"], imagePath: "/static/asparagus.png" },
  { id: 3, name: "ウコン", aliases: ["うこん", "ターメリック"], imagePath: "/static/turmeric.png" },
  { id: 4, name: "枝豆", aliases: ["えだまめ", "エダマメ"], imagePath: "/static/edamame.png" },
  { id: 5, name: "大葉", aliases: ["紫蘇", "しそ", "シソ"], imagePath: "/static/shiso.png" },
  { id: 6, name: "オクラ", aliases: ["おくら"], imagePath: "/static/okura.png" },
  { id: 7, name: "カブ", aliases: ["かぶ", "蕪"], imagePath: "/static/kabu.png" },
  { id: 8, name: "かぼちゃ", aliases: ["カボチャ", "南瓜"], imagePath: "/static/kabocha.png" },
  { id: 9, name: "カリフラワー", aliases: [], imagePath: "/static/cauliflower.png" },
  { id: 10, name: "キャベツ", aliases: ["きゃべつ"], imagePath: "/static/cabbage.png" },
  { id: 11, name: "きゅうり", aliases: [], imagePath: "/static/cucumber.png" },
  { id: 12, name: "空心菜", aliases: ["くうしんさい"], imagePath: "/static/kushinsai.png" },
  { id: 13, name: "クレソン", aliases: [], imagePath: "/static/kureson.png" },
  { id: 14, name: "ごぼう", aliases: [], imagePath: "/static/gobou.png" },
  { id: 15, name: "ごま", aliases: ["ゴマ", "胡麻"], imagePath: "/static/goma_shiro.png" },
  { id: 16, name: "小松菜", aliases: ["こまつな", "コマツナ"], imagePath: "/static/komatsuna.png" },
  { id: 17, name: "苦瓜", aliases: ["ゴーヤ", "ごーや"], imagePath: "/static/goya.png" },
  { id: 18, name: "こんにゃく", aliases: ["コンニャク"], imagePath: "/static/food_konnyaku.png" },
  { id: 19, name: "さつまいも", aliases: [], imagePath: "/static/satsumaimo.png" },
  { id: 20, name: "さといも", aliases: ["里芋"], imagePath: "/static/satoimo.png" },
  { id: 21, name: "さやいんげん", aliases: ["いんげんまめ", "インゲン豆", "インゲン"], imagePath: "/static/ingen.png" },
  { id: 22, name: "さやえんどう", aliases: ["えんどうまめ", "エンドウ豆", "きぬさや"], imagePath: "/static/sayaendou.png" },
  { id: 23, name: "ししとうがらし", aliases: ["ししとう"], imagePath: "/static/shishitou.png" },
  { id: 25, name: "じゃがいも", aliases: ["ジャガイモ"], imagePath: "/static/poteto.png" },
  { id: 26, name: "春菊", aliases: ["菊菜"], imagePath: "/static/syungiku.png" },
  { id: 27, name: "ズッキーニ", aliases: [], imagePath: "/static/zucchini.png" },
  { id: 28, name: "セロリ", aliases: [], imagePath: "/static/celery.png" },
  { id: 29, name: "そら豆", aliases: ["ソラマメ", "空豆"], imagePath: "/static/soramame.png" },
  { id: 30, name: "ターサイ", aliases: ["タアサイ"], imagePath: "/static/taasai.png" },
  { id: 31, name: "大根", aliases: ["だいこん", "ダイコン"], imagePath: "/static/daikon.png" },
  { id: 32, name: "高菜", aliases: ["たかな"], imagePath: "/static/takana.png" },
  { id: 33, name: "玉ねぎ", aliases: ["タマネギ", "たまねぎ"], imagePath: "/static/tamanegi.png" },
  { id: 34, name: "たけのこ", aliases: ["タケノコ", "筍"], imagePath: "/static/takenoko.png" },
  { id: 35, name: "チンゲン菜", aliases: ["青梗菜", "ちんげん菜"], imagePath: "/static/chingensai.png" },
  { id: 36, name: "つるむらさき", aliases: ["ツルムラサキ"] },
  { id: 37, name: "唐辛子", aliases: ["とうがらし"], imagePath: "/static/tougarashi.png" },
  { id: 38, name: "冬瓜とうがん", aliases: ["とうがん"], imagePath: "/static/tougan.png" },
  { id: 39, name: "とうみょう", aliases: ["豆苗"], imagePath: "/static/toumyou.png" },
  { id: 40, name: "とうもろこし", aliases: ["トウモロコシ", "コーン"], imagePath: "/static/corn.png" },
  { id: 41, name: "トマト", aliases: ["とまと"], imagePath: "/static/tomato.png" },
  { id: 42, name: "なす", aliases: ["なすび"], imagePath: "/static/eggplant.png" },
  { id: 43, name: "なばな", aliases: ["菜の花"], imagePath: "/static/nanohana.png" },
  { id: 44, name: "にら", aliases: ["ニラ", "韮"], imagePath: "/static/nira.png" },
  { id: 45, name: "にんにく", aliases: ["ニンニク"], imagePath: "/static/ninniku.png" },
  { id: 46, name: "人参", aliases: ["にんじん"], imagePath: "/static/carrot.png" },
  { id: 47, name: "ネギ", aliases: ["ねぎ", "長ネギ"], imagePath: "/static/green_onion.png" },
  { id: 48, name: "白菜", aliases: ["はくさい"], imagePath: "/static/hakusai.png" },
  { id: 49, name: "パセリ", aliases: [], imagePath: "/static/parsley.png" },
  { id: 50, name: "パプリカ", aliases: [], imagePath: "/static/paprika.png" },
  { id: 51, name: "ピーマン", aliases: [], imagePath: "/static/greenpepper.png" },
  { id: 52, name: "ふき", aliases: ["フキ"] },
  { id: 53, name: "ブロッコリー", aliases: [], imagePath: "/static/broccoli.png" },
  { id: 54, name: "ほうれん草", aliases: ["ほうれんそう", "ホウレンソウ"], imagePath: "/static/spinach.png" },
  { id: 55, name: "水菜", aliases: ["京菜"], imagePath: "/static/mizuna.png" },
  { id: 56, name: "みつば", aliases: ["三つ葉"], imagePath: "/static/mitsuba.png" },
  { id: 57, name: "モロヘイヤ", aliases: [], imagePath: "/static/moroheiya.png" },
  { id: 58, name: "ヤーコン", aliases: [], imagePath: "/static/yacon.png" },
  { id: 59, name: "落花生", aliases: ["ピーナッツ"], imagePath: "/static/peanut.png" },
  { id: 60, name: "レタス", aliases: [], imagePath: "/static/lettuce.png" },
  { id: 61, name: "れんこん", aliases: ["レンコン", "蓮根"], imagePath: "/static/renkon.png" },
  { id: 62, name: "牛肉", aliases: [], imagePath: "/static/niku_gyu.png" },
  { id: 63, name: "豚肉", aliases: [], imagePath: "/static/niku_buta.png" },
  { id: 64, name: "鶏もも", aliases: ["とりもも", "とりもも肉", "鶏もも肉"], imagePath: "/static/niku_tori_momo.png" },
  { id: 65, name: "鶏むね", aliases: ["とりむね", "とりむね肉", "鶏むね肉"] },
  { id: 66, name: "鶏ささみ", aliases: ["とりささみ", "とりささみ肉", "鶏ささみ肉"], imagePath: "/static/food_niku_tori_sasami.png" },
  { id: 67, name: "鶏手羽元", aliases: ["とり手羽元", "鶏手羽", "とりてば肉"], imagePath: "/static/food_chicken_tebamoto_nama.png" },
  { id: 68, name: "鶏手羽先", aliases: ["手羽先", "手羽先肉", "てばさき"], imagePath: "/static/food_chicken_tebasaki_nama.png" },
  { id: 69, name: "さば", aliases: ["サバ", "鯖"], imagePath: "/static/fish_saba2.png" },
  { id: 70, name: "いわし", aliases: ["鰯", "イワシ"], imagePath: "/static/fish_sakana_iwashi.png" },
  { id: 71, name: "さんま", aliases: ["秋刀魚", "サンマ"], imagePath: "/static/fish_sakana_sanma.png" },
  { id: 72, name: "たら", aliases: ["タラ", "鱈"], imagePath: "/static/fish_tara.png" },
  { id: 73, name: "あじ", aliases: ["アジ", "鯵"], imagePath: "/static/fish_aji2.png" },
  { id: 74, name: "ぶり", aliases: ["ブリ", "鰤"], imagePath: "/static/fish_buri2.png" },
  { id: 75, name: "まぐろ", aliases: ["マグロ", "鮪"], imagePath: "/static/sashimi_maguro_akami.png" },
  { id: 76, name: "しめじ", aliases: ["シメジ"], imagePath: "/static/shimeji.png" },
  { id: 77, name: "エリンギ", aliases: ["えりんぎ"], imagePath: "/static/eringi.png" },
  { id: 78, name: "えのき", aliases: ["エノキ", "エノキタケ"], imagePath: "/static/enoki.png" },
  { id: 79, name: "しいたけ", aliases: ["シイタケ", "椎茸"], imagePath: "/static/shiitake.png" },
  { id: 80, name: "しょうが", aliases: ["ショウガ", "生姜"], imagePath: "/static/syouga.png" },
  { id: 81, name: "鮭", aliases: ["しゃけ", "シャケ", "さけ", "サケ"], imagePath: "/static/sake_kirimi.png" },
];

const idIndex = new Map<number, Product>();
for (const product of PRODUCTS) {
  idIndex.set(product.id, product);
}

export class ProductRepository {

  private static instance: ProductRepository;

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new ProductRepository();
    }
    return this.instance;
  }

  public findByNames(names: string[]) {
    const productSet = new Set<Product>();
    for (const name of names) {
      for (const product of PRODUCTS) {
        if (product.name.includes(name) || product.aliases.some(alias => alias.includes(name))) {
          productSet.add(product);
        }
      }
    }
    return [...productSet.values()];
  }

  public findById(id: number) {
    return idIndex.get(id);
  }

}