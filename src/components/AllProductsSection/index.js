import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const productStatusConstants = {
  isLoading: 'loading',
  isSuccess: 'success',
  isFailure: 'failure',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    productStatus: productStatusConstants.isSuccess,
    activeOptionId: sortbyOptions[0].optionId,
    categoryId: '',
    ratingId: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      productStatus: productStatusConstants.isLoading,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {activeOptionId, categoryId, ratingId, searchInput} = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${categoryId}&title_search=${searchInput}&rating=${ratingId}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        productStatus: productStatusConstants.isSuccess,
      })
    } else {
      this.setState({productStatus: productStatusConstants.isFailure})
    }
  }

  onChangeSearchInput = value => {
    this.setState({searchInput: value})
  }

  changeCategory = categoryId => {
    this.setState({categoryId}, this.getProducts)
  }

  changeRating = ratingId => {
    this.setState({ratingId}, this.getProducts)
  }

  onEnterSearchInput = () => {
    this.getProducts()
  }

  clearFilters = () => {
    this.setState(
      {categoryId: '', ratingId: '', searchInput: ''},
      this.getProducts,
    )
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    // TODO: Add No Products View
    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        {productsList.length > 0 ? (
          <ul className="products-list">
            {productsList.map(product => (
              <ProductCard productData={product} key={product.id} />
            ))}
          </ul>
        ) : (
          <div className="failure-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
              alt="no products"
            />
            <h1 className="oops">No Products Found</h1>
            <p className="para">
              {' '}
              We could not find any products. Try other filters
            </p>
          </div>
        )}
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view

  renderFailure = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
      />
      <h1 className="oops">Oops! Something Went Wrong</h1>
      <p className="para">
        We are having some trouble processing your request. <br /> Please try
        again.
      </p>
    </div>
  )

  render() {
    const {productStatus, searchInput} = this.state
    let result
    switch (productStatus) {
      case productStatusConstants.isLoading:
        result = this.renderLoader()
        break
      case productStatusConstants.isSuccess:
        result = this.renderProductsList()
        break
      case productStatusConstants.isFailure:
        result = this.renderFailure()
        break
      default:
        result = null
    }

    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          searchInput={searchInput}
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          changeCategory={this.changeCategory}
          changeRating={this.changeRating}
          clearFilters={this.clearFilters}
          onChangeSearchInput={this.onChangeSearchInput}
          onEnterSearchInput={this.onEnterSearchInput}
        />
        {result}
      </div>
    )
  }
}

export default AllProductsSection
