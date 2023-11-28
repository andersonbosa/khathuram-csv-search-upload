// SearchResults.js


interface SearchResultsProps {
  results: string[]
}

function SearchResults ({ results }: SearchResultsProps) {
  return (
    <div>
      <section>
        <h1>Results</h1>
      </section>

      <br />

      <ul>
        {results.map((result, index) => (<li key={index}>{result}</li>))}
      </ul>
    </div>
  )
}

export default SearchResults
