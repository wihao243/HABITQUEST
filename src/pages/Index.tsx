// ... (código anterior)  

<Tabs defaultValue="daily" className="w-full">  
  {/* ... (otros tabs) */}  
  <TabsTrigger value="shopEditor" className="rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-black text-[10px] uppercase tracking-tighter">  
    <Package className="w-4 h-4 mr-1 hidden md:block" /> Editar Tienda  
  </TabsTrigger>  
  <TabsContent value="shopEditor">  
    <ShopEditor onSave={() => { /* Forzar actualización de la tienda */ }} />  
  </TabsContent>  
</Tabs>  

// ... (código posterior)  