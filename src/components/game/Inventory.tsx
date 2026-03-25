// ... (código anterior)  

return (  
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">  
    {/* ... (código anterior) */}  

    {allDisplayItems.length === 0 && (  
      <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">  
        <p className="text-slate-400 font-bold italic">Tu inventario está vacío. ¡Gana oro y date un capricho!</p>  
      </div>  
    )}  

    {/* Mostrar descripción solo si el item tiene temporizador activo */}  
    {allDisplayItems.map(item => {  
      const timeLeft = activeTimers[item.id];  
      const isPaused = pausedTimers[item.id];  
      const count = itemCounts[item.id] || 0;  

      return (  
        <Card key={item.id} className={cn(  
          "p-4 border-2 border-slate-200 bg-white flex flex-col gap-3 shadow-sm hover:border-indigo-300 transition-colors",  
          timeLeft && "border-indigo-500 bg-indigo-50/30"  
        )}>  

          {/* ... (código anterior del Card) */}  

          {/* Mostrar descripción si hay temporizador activo */}  
          {timeLeft && (  
            <div className="mt-2 text-sm text-slate-500 italic">  
              <p>{item.description}</p>  
            </div>  
          )}  

          {/* ... (código posterior del Card) */}  
        </Card>  
      );  
    })}  
  </div>  
);  