export function NoteCard(){
    return(
        <button className=" outline-none text-left rounded-md bg-slate-700 p-5 space-y-3 hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
          <span className="text-sm font-medium text-slate-300">há 2 dias</span>
          <p className=" text-sm leading-6 text-slate-400">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat
            molestiae, vero exercitationem rerum consequatur aperiam delectus
            accusamus, earum, necessitatibus ut ad reprehenderit. Incidunt
            perspiciatis nam quis saepe pariatur architecto totam.
          </p>

          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none" />
        </button>
    )
}