
import { Header } from '../../components/Header';
import api from '../../services/api';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import { useEffect, useState } from 'react';


interface Foods {
    id: number;
    name: string;
    description: string;
    price: string;
    available: boolean;
    image: string;
}
export function Dashboard() {
    const [foods, setFoods] = useState<Foods[]>([]);
    const [editingFood, setEditingFood] = useState({} as Foods);
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    
    useEffect(() => {
        async function loadFoods() {
            const response = await api.get('foods');
            setFoods(response.data)
        }
        loadFoods();
    }, [])

    //FUNÇÃO DE ADICIONAR UMA COMIDA
    async function handleAddFood(food: Foods) {
        try {
            const response = await api.post('/foods', {
              ...food,
              available: true,
            });
      
            setFoods([...foods, response.data])
          } catch (err) {
            console.log(err);
    }
    }

    async function handleUpdateFood(food: Foods) {
        try {
            const foodUpdated = await api.put(
              `/foods/${editingFood.id}`,
              { ...editingFood, ...food },
            );
      
            const foodsUpdated = foods.map(food =>
              food.id !== foodUpdated.data.id ? food : foodUpdated.data,
            );
      
            setFoods(foodsUpdated);
          } catch (err) {
            console.log(err);
          }
    }

    async function handleDeleteFood(id: number) {
        const updatedFoods = [...foods];
        await api.delete(`/foods/${id}`);
        const foodsFiltered = updatedFoods.filter(food => food.id !== id);
        setFoods(foodsFiltered);
    }

    async function handleEditFood(food: Foods) {
        setEditingFood(food);
        setEditModalOpen(true)
    }

    function toggleModal() {
       modalOpen ? setModalOpen(false) : setModalOpen(true);
    }

    function toggleEditModal() {
      editModalOpen ? setEditModalOpen(false) : setEditModalOpen(true);
    }
    
      return (
        <>
          <Header openModal={toggleModal} />
          <ModalAddFood
            isOpen={modalOpen}
            setIsOpen={toggleModal}
            handleAddFood={handleAddFood}
          />
          <ModalEditFood
            isOpen={editModalOpen}
            setIsOpen={toggleEditModal}
            editingFood={editingFood}
            handleUpdateFood={handleUpdateFood}
          />
  
          <FoodsContainer data-testid="foods-list">
            {foods &&
              foods.map(food => (
                <Food
                  key={food.id}
                  food={food}
                  handleDelete={handleDeleteFood}
                  handleEditFood={handleEditFood}
                />
              ))}
          </FoodsContainer>
        </>
      );
}


