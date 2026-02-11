<?php

namespace App\Form;

use App\Entity\User;
use App\Entity\Parapluie;
use Symfony\Component\Validator\Constraints\File;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\FileType;


class ParaForm extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name')
            ->add('imageFile',FileType::class, [
                'label' => 'Image du parapluie',
                'required' => false,
                'constraints' => [
                    new File ([
                        'maxSize' => '8M' ,
                        'mimeTypes' => [
                            'image/jpeg' ,
                            'image/png' ,
                            'image/gif' ,
                        ],
                        'mimeTypesMessage' => 'Veuillez uploader une image valide (JPEG,PNG,GIF).',
                    ])
                ],
             ])
            ->add('user')
            ->add('description')
            ->add('price');
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Parapluie::class,
        ]);
    }
}
