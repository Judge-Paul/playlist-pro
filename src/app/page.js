import Image from 'next/image'

export default function Home() {
  return (
    <main>
      <form className="mx-auto text-center bg-blue-600 w-[400px] h-[800px]">
        <input type="text" className='mt-5' />
        <button className="block bg-green-500 hover:bg-green-700">
          Submit
        </button>
      </form>
    </main>
  )
}
