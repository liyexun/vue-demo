const eventsBus = new Vue();

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            require: true
        }
    },

    template: `
<div>
    <div class="tabs">
    <ul>
      <li :class="{'is-active' : selectedTab === tab}"
      @click="selectedTab = tab"
      v-for="tab in tabs"><a>{{tab}}</a></li>
    </ul>
  </div>
  <div v-show="selectedTab === tabs[0]">
  <p v-if="!reviews.length">该商品还没有评价！</p>
    <div class="box" v-for="r in reviews">
     {{r.review}}
    <p class="has-text-right heading">
        <span class="has-text-info">{{r.name}}</span>给商品评了
        <span class="has-text-danger">{{r.rating}}</span>分
    </p>
    </div>
   </div>
   <div v-show="selectedTab === tabs[1]">
   <product-review ></product-review>
   </div>
</div>
    `,

    data() {
        return {
            selectedTab: '商品评价',
            tabs: ['商品评价', '发布评价'],
        }
    }
})

Vue.component('product-review', {
    template: `
    <form @submit.prevent="onSubmit" class="notification">
    <div class="field">
        <label class="label">名称</label>
        <div class="control">
          <input class="input" type="text" v-model="name">
        </div>
      </div>
      <div class="field">
        <label class="label">评价</label>
        <div class="control">
            <textarea class="textarea" v-model="review"></textarea>
        </div>
      </div>
      <div class="field">
        <label class="label">评分</label>
        <div class="control">
          <div class="select">
              <select class="select" v-model.number="rating" >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
              </select>
          </div>
        </div>
      </div>
      <div class="field is-grouped">
        <div class="control">
            <button class="button is-link">提交</button>
        </div>
      </div>
      <div class="has-text-danger">
           <ul v-for="error in errors">{{error}}</ul>
       </div>
</form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            //判断是否输入评价信息
            this.errors = [];
            if (this.name && this.review && this.rating) {
                const productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                eventsBus.$emit('add-product-review', productReview);
                this.name = null;
                this.review = null;
                this.rating = null;
            } else {
                if (!this.name) {
                    this.errors.push('请填写用户信息');
                }
                if (!this.review) {
                    this.errors.push('请填写商品评价');
                }
                if (!this.rating) {
                    this.errors.push('请填写评分');
                }
            }

        }
    }
})


Vue.component('app-product', {
    props: {
        discount: {
            type: Number,
            required: true
        }


    },
    template: `<section class="section">
    <div class="container box">
        <div class="columns">
            <div class="column">
                <img v-bind:src="image" alt="">
            </div>
            <div class="column">
                
                <br>
                <h2 class="title is-4">{{title}}</h2>
                <hr>
                <div>
                <p class="haeding">价格</p>
                <h4 class="title is-4 has-text-danger">￥{{price}}</h4>
                </div>
                <hr>
                <span class="tag" v-if="inStock"
                >有现货</span>
                <span class="tag is-danger" v-else>缺货</span>
                <hr>
                <div>
                    <p class="heading">颜色</p>
                    <div class="buttons">
                        <span class="button is-small"
                        v-for="(kind,index) in productKinds"
                        :key="kind.id"
                        @click="updateProduct(index)">
                        <span class="dot" :style="{color : kind.color}"></span>
                        {{ kind.colorName }}</span>
                        
                    </div>
                </div>
                <hr>
                <button class="button is-info" 
                v-on:click="addToCart"
                :disabled="!inStock"
                :class="{disabled : !inStock}">
                    加入购物车
                </button>
            </div>
        </div>
        <product-tabs :reviews="reviews"></product-tabs>    
        <br>
     
    </div>
</section>`,
    data() {
        return {
            brand: '坚果',
            product: ' PRO 2S',
            riginerPrice: 5000,
            reviews: [],
            selected: 0,
            productKinds: [{
                    id: 1,
                    colorName: '喵呜蓝',
                    image: './images/blue.png',
                    color: 'blue',
                    quantity: 0
                },
                {
                    id: 2,
                    colorName: '冬日红',
                    image: './images/red.png',
                    color: 'red',
                    quantity: 10
                },
                {
                    id: 3,
                    colorName: '深邃黑',
                    image: './images/black.png',
                    color: 'black',
                    quantity: 10
                },

            ],
            cart: 0
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        inStock() {
            return this.productKinds[this.selected].quantity > 0
        },
        image() {
            return this.productKinds[this.selected].image;
        },
        price() {
            return this.riginerPrice * this.discount;
        }
    },
    mounted() {
        eventsBus.$on('add-product-review', review => {
            this.reviews.push(review);
        })
    },

    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.productKinds[this.selected].id);
        },
        updateProduct(index) {
            this.selected = index;
        }

    }
})

var vm = new Vue({
    el: '#app',
    data: {
        discount: 0.95,
        cart: []
    },
    methods: {
        updataCart(id) {
            this.cart.push(id);
        },
    }
});