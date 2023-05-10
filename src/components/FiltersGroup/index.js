import {BiSearchAlt} from 'react-icons/bi'
import './index.css'

const FiltersGroup = props => {
  const {
    categoryOptions,
    clearFilters,
    ratingsList,
    changeRating,
    changeCategory,
    onChangeSearchInput,
    searchInput,
    onEnterSearchInput,
  } = props

  const onChangeCategory = categoryId => {
    changeCategory(categoryId)
  }

  const onChangeRating = ratingId => {
    changeRating(ratingId)
  }

  const onClearFilters = () => {
    clearFilters()
  }

  const onEnterSearch = event => {
    if (event.key === 'Enter') {
      onEnterSearchInput()
    }
  }

  const onChangeInput = event => {
    onChangeSearchInput(event.target.value)
  }

  return (
    <div className="filters-group-container">
      <div className="search-input">
        <input
          value={searchInput}
          onChange={onChangeInput}
          onKeyDown={onEnterSearch}
          className="search"
          type="search"
          placeholder="Search"
        />
        <BiSearchAlt className="icon" />
      </div>
      <h1 className="heading">Category</h1>
      <ul className="category-container">
        {categoryOptions.map(eachItem => (
          <li onClick={() => onChangeCategory(eachItem.categoryId)}>
            <p className="category-name">{eachItem.name}</p>
          </li>
        ))}
      </ul>
      <h1 className="heading">Rating</h1>
      <ul className="ratings-container">
        {ratingsList.map(eachItem => (
          <li
            onClick={() => onChangeRating(eachItem.ratingId)}
            className="list"
          >
            <img
              className="rating-image"
              alt={`rating ${eachItem.ratingId}`}
              src={eachItem.imageUrl}
            />
            <p className="up">& Up</p>
          </li>
        ))}
      </ul>
      <button onClick={onClearFilters} type="button" className="button">
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
