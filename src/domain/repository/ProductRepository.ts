import type { Product } from "../entity/Product.js";

const PRODUCTS: Product[] = [
  { id: 1, name: "明日葉", aliases: ["あしたば", "アシタバ"] },
  { id: 2, name: "アスパラガス", aliases: ["アスパラ", "あすぱら", "あすぱらがす"] },
  { id: 3, name: "ウコン", aliases: ["うこん", "ターメリック"] },
  { id: 4, name: "枝豆", aliases: ["えだまめ", "エダマメ"] },
  { id: 5, name: "大葉", aliases: ["紫蘇", "しそ", "シソ"] },
  { id: 6, name: "オクラ", aliases: ["おくら"] },
  { id: 7, name: "カブ", aliases: ["かぶ", "蕪"] },
  { id: 8, name: "かぼちゃ", aliases: ["カボチャ", "南瓜"] },
  { id: 9, name: "カリフラワー", aliases: [] },
  { id: 10, name: "キャベツ", aliases: ["きゃべつ"] },
  { id: 11, name: "きゅうり", aliases: [] },
  { id: 12, name: "空心菜", aliases: ["くうしんさい"] },
  { id: 13, name: "クレソン", aliases: [] },
  { id: 14, name: "ごぼう", aliases: [] },
  { id: 15, name: "ごま", aliases: ["ゴマ", "胡麻"] },
  { id: 16, name: "小松菜", aliases: ["こまつな", "コマツナ"] },
  { id: 17, name: "苦瓜", aliases: ["ゴーヤ", "ごーや"] },
  { id: 18, name: "こんにゃく", aliases: ["コンニャク"] },
  { id: 19, name: "さつまいも", aliases: [] },
  { id: 20, name: "さといも", aliases: ["里芋"] },
  { id: 21, name: "さやいんげん", aliases: ["いんげんまめ", "インゲン豆", "インゲン"] },
  { id: 22, name: "さやえんどう", aliases: ["えんどうまめ", "エンドウ豆", "きぬさや"] },
  { id: 23, name: "ししとうがらし", aliases: ["ししとう"] },
  { id: 25, name: "じゃがいも", aliases: ["ジャガイモ"] },
  { id: 26, name: "春菊", aliases: ["菊菜"] },
  { id: 27, name: "ズッキーニ", aliases: [] },
  { id: 28, name: "セロリ", aliases: [] },
  { id: 29, name: "そら豆", aliases: ["ソラマメ", "空豆"] },
  { id: 30, name: "ターサイ", aliases: ["タアサイ"] },
  { id: 31, name: "大根", aliases: ["だいこん", "ダイコン"] },
  { id: 32, name: "高菜", aliases: ["たかな"] },
  { id: 33, name: "玉ねぎ", aliases: ["タマネギ", "たまねぎ"] },
  { id: 34, name: "たけのこ", aliases: ["タケノコ", "筍"] },
  { id: 35, name: "チンゲン菜", aliases: ["青梗菜", "ちんげん菜"] },
  { id: 36, name: "つるむらさき", aliases: ["ツルムラサキ"] },
  { id: 37, name: "唐辛子", aliases: ["とうがらし"] },
  { id: 38, name: "冬瓜とうがん", aliases: ["とうがん"] },
  { id: 39, name: "とうみょう", aliases: ["豆苗"] },
  { id: 40, name: "とうもろこし", aliases: ["トウモロコシ", "コーン"] },
  { id: 41, name: "トマト", aliases: ["とまと"] },
  { id: 42, name: "なす", aliases: ["なすび"] },
  { id: 43, name: "なばな", aliases: ["菜の花"] },
  { id: 44, name: "にら", aliases: ["ニラ", "韮"] },
  { id: 45, name: "にんにく", aliases: ["ニンニク"] },
  { id: 46, name: "人参", aliases: ["にんじん"] },
  { id: 47, name: "ネギ", aliases: ["ねぎ", "長ネギ"] },
  { id: 48, name: "白菜", aliases: ["はくさい"] },
  { id: 49, name: "パセリ", aliases: [] },
  { id: 50, name: "パプリカ", aliases: [] },
  { id: 51, name: "ピーマン", aliases: [] },
  { id: 52, name: "ふき", aliases: ["フキ"] },
  { id: 53, name: "ブロッコリー", aliases: [] },
  { id: 54, name: "ほうれん草", aliases: ["ほうれんそう", "ホウレンソウ"] },
  { id: 55, name: "水菜", aliases: ["京菜"] },
  { id: 56, name: "みつば", aliases: ["三つ葉"] },
  { id: 57, name: "モロヘイヤ", aliases: [] },
  { id: 58, name: "ヤーコン", aliases: [] },
  { id: 59, name: "落花生", aliases: ["ピーナッツ"] },
  { id: 60, name: "レタス", aliases: [] },
  { id: 61, name: "れんこん", aliases: ["レンコン", "蓮根"] },
  { id: 62, name: "牛肉", aliases: [] },
  { id: 63, name: "豚肉", aliases: [] },
  { id: 64, name: "鶏もも", aliases: [] },
  { id: 65, name: "鶏むね", aliases: [] },
  { id: 66, name: "鶏ささみ", aliases: [] },
  { id: 67, name: "鶏手羽元", aliases: [] },
  { id: 68, name: "鶏手羽先", aliases: [] },
  { id: 69, name: "さば", aliases: ["サバ", "鯖"] },
  { id: 70, name: "いわし", aliases: ["鰯", "イワシ"] },
  { id: 71, name: "さんま", aliases: ["秋刀魚", "サンマ"] },
  { id: 72, name: "たら", aliases: ["タラ", "鱈"] },
  { id: 73, name: "あじ", aliases: ["アジ", "鯵"] },
  { id: 74, name: "ぶり", aliases: ["ブリ", "鰤"] },
  { id: 75, name: "まぐろ", aliases: ["マグロ", "鮪"] }
];

const nameIndex = new Map<string, Product>();
const idIndex = new Map<number, Product>();
for (const product of PRODUCTS) {
  idIndex.set(product.id, product);
  nameIndex.set(product.name, product);
  for (const alias of product.aliases) {
    nameIndex.set(alias, product);
  }
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
    return names
      .map(name => nameIndex.get(name))
      .filter(product => product != null);
  }

  public findById(id: number) {
    return idIndex.get(id);
  }

}